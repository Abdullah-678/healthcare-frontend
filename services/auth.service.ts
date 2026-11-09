"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { deleteCookie } from "@/lib/cookieUtils";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";
import axios from "axios";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    if (!sessionToken) {
      console.error("Token refresh failed: session cookie is missing");
      return false;
    }

    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) {
      console.error("Token refresh failed:", res.status, res.statusText);
      return false;
    }

    const { data } = await res.json();

    const {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken: newSessionToken,
    } = data;

    if (!accessToken || !newRefreshToken || !newSessionToken) {
      console.error("Token refresh failed: response did not include all tokens");
      return false;
    }

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", newRefreshToken);
    await setTokenInCookies(
      "better-auth.session_token",
      newSessionToken,
      24 * 60 * 60,
    );

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken || !sessionToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export const logoutAction = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await fetch(`${BASE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.warn("Backend logout request failed:", response.status);
    }
  } catch (error) {
    console.warn(
      "Backend logout request could not be completed:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  try {
    await Promise.all([
      deleteCookie("accessToken"),
      deleteCookie("refreshToken"),
      deleteCookie("better-auth.session_token"),
      deleteCookie("better-auth.session_data"),
    ]);
  } catch (cookieError) {
    console.error("Failed to clear auth cookies during logout.", cookieError);
    throw cookieError;
  }

};

export const registerAction = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await httpClient.post("/auth/register", payload);

    return response;
  } catch (error: unknown) {
    console.error("Registration failed:", error);

    return {
      success: false,
      message:
        (axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined) ||
        (error instanceof Error ? error.message : undefined) ||
        "Registration failed",
    };
  }
};
