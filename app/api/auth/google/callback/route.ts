import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  normalizeUserRole,
} from "@/lib/authUtils";

interface GoogleAuthHandoff extends JwtPayload {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
  redirectPath: string;
}

const isGoogleAuthHandoff = (
  payload: string | JwtPayload,
): payload is GoogleAuthHandoff =>
  typeof payload !== "string" &&
  typeof payload.accessToken === "string" &&
  typeof payload.refreshToken === "string" &&
  typeof payload.sessionToken === "string" &&
  typeof payload.redirectPath === "string";

const getLoginErrorResponse = (request: NextRequest) => {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "oauth_failed");
  return NextResponse.redirect(loginUrl);
};

export async function POST(request: NextRequest) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const accessTokenSecret =
    process.env.JWT_ACCESS_SECRET ?? process.env.ACCESS_TOKEN_SECRET;

  if (!apiBaseUrl || !accessTokenSecret) {
    console.error(
      "Google OAuth handoff requires NEXT_PUBLIC_API_BASE_URL and an access token secret.",
    );
    return NextResponse.json(
      { error: "Google sign-in is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const ticket = formData.get("ticket");
  if (typeof ticket !== "string" || ticket.length > 8192) {
    return getLoginErrorResponse(request);
  }

  let handoff: GoogleAuthHandoff;
  let role: ReturnType<typeof normalizeUserRole>;
  try {
    const payload = jwt.verify(ticket, accessTokenSecret, {
      audience: "healthcare-frontend-google-auth",
      issuer: "healthcare-backend",
    });
    if (!isGoogleAuthHandoff(payload)) {
      return getLoginErrorResponse(request);
    }

    const accessTokenPayload = jwt.verify(
      payload.accessToken,
      accessTokenSecret,
    );
    if (typeof accessTokenPayload === "string") {
      return getLoginErrorResponse(request);
    }

    role = normalizeUserRole(accessTokenPayload.role);
    if (!role) {
      return getLoginErrorResponse(request);
    }
    handoff = payload;
  } catch {
    return getLoginErrorResponse(request);
  }

  const requestedPath = handoff.redirectPath;
  const targetPath =
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.includes("\\") &&
    isValidRedirectForRole(requestedPath, role)
      ? requestedPath
      : getDefaultDashboardRoute(role);

  const response = NextResponse.redirect(
    new URL(targetPath, request.url),
    303,
  );
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  response.cookies.set("accessToken", handoff.accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24,
  });
  response.cookies.set("refreshToken", handoff.refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("better-auth.session_token", handoff.sessionToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24,
  });

  return response;
}
