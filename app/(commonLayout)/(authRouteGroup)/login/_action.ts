"use server";

import axios from "axios";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

export type LoginActionResult =
  | { success: true; redirectTo: string }
  | { success: false; message: string };

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<LoginActionResult> => {
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<{
      accessToken: string;
      refreshToken: string;
      token: string;
      user: {
        needPasswordChange: boolean;
        email: string;
        role: string;
      };
    }>(
      "/auth/login",
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role, needPasswordChange, email } = user;
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds

    if (needPasswordChange) {
      return {
        success: true,
        redirectTo: `/reset-password?email=${encodeURIComponent(email)}`,
      };
    }

    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    return { success: true, redirectTo: targetPath };
  } catch (error: unknown) {
    if (
      axios.isAxiosError<ApiErrorResponse>(error) &&
      error.response?.data.message === "Email not verified"
    ) {
      return {
        success: true,
        redirectTo: `/verify-email?email=${encodeURIComponent(payload.email)}`,
      };
    }

    console.error("Login failed:", error);
    return {
      success: false,
      message: `Login failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
