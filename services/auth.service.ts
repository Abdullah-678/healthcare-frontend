"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    const { data } = await res.json();

    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken) {
      await setTokenInCookies("accessToken", accessToken);
    }

    if (newRefreshToken) {
      await setTokenInCookies("refreshToken", newRefreshToken);
    }

    if (token) {
      await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
    }

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

    if (!accessToken) {
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
  try {
    await httpClient.post("/auth/logout", {});

    await setTokenInCookies("accessToken", "", 0);
    await setTokenInCookies("refreshToken", "", 0);
    await setTokenInCookies("better-auth.session_token", "", 0);

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    console.error("Logout failed:", error);

    // Clear cookies even if the backend logout request fails
    await setTokenInCookies("accessToken", "", 0);
    await setTokenInCookies("refreshToken", "", 0);
    await setTokenInCookies("better-auth.session_token", "", 0);

    return {
      success: false,
      message: error?.response?.data?.message || "Logout failed",
    };
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
  } catch (error: any) {
    console.error("Registration failed:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed",
    };
  }
};
