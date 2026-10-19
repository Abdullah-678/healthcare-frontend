import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpired, isTokenExpiringSoon } from "./lib/tokenUtils";
import { getUserInfo } from "./services/auth.service";

interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
}

const getRefreshedCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
});

const setRefreshedCookies = (
  response: NextResponse,
  tokens: RefreshedTokens,
) => {
  const cookieOptions = getRefreshedCookieOptions();

  response.cookies.set("accessToken", tokens.accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24,
  });
  response.cookies.set("refreshToken", tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("better-auth.session_token", tokens.sessionToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24,
  });
};

async function refreshTokenMiddleware(
  refreshToken: string,
  sessionToken: string,
): Promise<RefreshedTokens | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const response = await fetch(`${apiBaseUrl}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
    },
  });

  if (!response.ok) {
    console.error(
      "Token refresh failed in proxy:",
      response.status,
      response.statusText,
    );
    return null;
  }

  const { data } = await response.json();
  const tokens: RefreshedTokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    sessionToken: data.sessionToken,
  };

  if (
    !tokens.accessToken ||
    !tokens.refreshToken ||
    !tokens.sessionToken
  ) {
    throw new Error("Token refresh response did not include all tokens");
  }

  return tokens;
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl; // eg /dashboard, /admin/dashboard, /doctor/dashboard
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const sessionToken = request.cookies.get(
      "better-auth.session_token",
    )?.value;
    const accessTokenSecret =
      process.env.JWT_ACCESS_SECRET ?? process.env.ACCESS_TOKEN_SECRET;

    if (accessToken && !accessTokenSecret) {
      throw new Error("JWT_ACCESS_SECRET or ACCESS_TOKEN_SECRET is required");
    }

    const accessTokenVerification =
      accessToken && accessTokenSecret
        ? jwtUtils.verifyToken(accessToken, accessTokenSecret)
        : null;
    const decodedAccessToken = accessTokenVerification?.data;
    const isValidAccessToken = accessTokenVerification?.success ?? false;

    let userRole: UserRole | null = null;

    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routerOwner = getRouteOwner(pathname);

    const unifySuperAdminAndAdminRole =
      userRole === "SUPERADMIN" ? "ADMIN" : userRole;

    userRole = unifySuperAdminAndAdminRole;

    const isAuth = isAuthRoute(pathname);

    //proactively refresh token if refresh token exists and access token is expired or about to expire
    if (
      accessToken &&
      refreshToken &&
      sessionToken &&
      ((await isTokenExpiringSoon(accessToken)) ||
        (await isTokenExpired(accessToken)))
    ) {
      const requestHeaders = new Headers(request.headers);

      try {
        const refreshedTokens = await refreshTokenMiddleware(
          refreshToken,
          sessionToken,
        );

        if (refreshedTokens) {
          if (!accessTokenSecret) {
            throw new Error(
              "JWT_ACCESS_SECRET or ACCESS_TOKEN_SECRET is required",
            );
          }

          const forwardedCookies = new Map(
            request.cookies.getAll().map(({ name, value }) => [name, value]),
          );
          forwardedCookies.set("accessToken", refreshedTokens.accessToken);
          forwardedCookies.set("refreshToken", refreshedTokens.refreshToken);
          forwardedCookies.set(
            "better-auth.session_token",
            refreshedTokens.sessionToken,
          );
          requestHeaders.set(
            "cookie",
            Array.from(forwardedCookies, ([name, value]) => `${name}=${value}`)
              .join("; "),
          );

          const refreshedAccessToken = jwtUtils.verifyToken(
            refreshedTokens.accessToken,
            accessTokenSecret,
          );
          const refreshedUserRole =
            refreshedAccessToken.data?.role === "SUPERADMIN"
              ? "ADMIN"
              : (refreshedAccessToken.data?.role as UserRole | undefined);

          if (!refreshedAccessToken.success || !refreshedUserRole) {
            throw new Error("Refreshed access token is invalid");
          }

          const routeRequiresRole =
            routerOwner === "ADMIN" ||
            routerOwner === "DOCTOR" ||
            routerOwner === "PATIENT";
          if (routeRequiresRole && routerOwner !== refreshedUserRole) {
            const redirectResponse = NextResponse.redirect(
              new URL(
                getDefaultDashboardRoute(refreshedUserRole),
                request.url,
              ),
            );
            setRefreshedCookies(redirectResponse, refreshedTokens);
            return redirectResponse;
          }

          if (isAuth) {
            const redirectResponse = NextResponse.redirect(
              new URL(
                getDefaultDashboardRoute(refreshedUserRole),
                request.url,
              ),
            );
            setRefreshedCookies(redirectResponse, refreshedTokens);
            return redirectResponse;
          }

          const nextResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          setRefreshedCookies(nextResponse, refreshedTokens);
          return nextResponse;
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }

    // Rule - 1: Redirect authenticated users away from auth routes only when
    // the session can also load user info.
    if (isAuth && isValidAccessToken) {
      const userInfo = await getUserInfo();

      if (userInfo) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }

    // Rule - 2 : User is trying to access reset password page
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");

      // case - 1 user has needPasswordChange true
      //no need for case 1 if need password change is handled from change-password page
      if (accessToken && email) {
        const userInfo = await getUserInfo();

        if (userInfo.needPasswordChange) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }

      // Case-2 user coming from forgot password

      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-3 User trying to access Public route -> allow
    if (routerOwner === null) {
      return NextResponse.next();
    }

    // Rule - 4 User is Not logged in but trying to access protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    //Rule - Enforcing user to stay in reset password or verify email page if their needPasswordChange or isEmailVerified flags are not satisfied respectively

    if (accessToken) {
      const userInfo = await getUserInfo();

      if (userInfo) {
        // need email verification scenario
        if (userInfo.emailVerified === false) {
          if (pathname !== "/verify-email") {
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
          }

          return NextResponse.next();
        }

        if (userInfo.emailVerified && pathname === "/verify-email") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }

        // need password change scenario
        if (userInfo.needPasswordChange) {
          if (pathname !== "/reset-password") {
            const resetPasswordUrl = new URL("/reset-password", request.url);
            resetPasswordUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(resetPasswordUrl);
          }

          return NextResponse.next();
        }

        if (!userInfo.needPasswordChange && pathname === "/reset-password") {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole as UserRole),
              request.url,
            ),
          );
        }
      }
    }

    // Rule - 5 User trying to access Common protected route -> allow
    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    //Rule-6 User trying to visit role based protected but doesn't have required role -> redirect to their default dashboard

    if (
      routerOwner === "ADMIN" ||
      routerOwner === "DOCTOR" ||
      routerOwner === "PATIENT"
    ) {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
