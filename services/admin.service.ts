"use server";

import axios from "axios";
import { httpClient } from "@/lib/axios/httpClient";
import {
  IAdmin,
  ICreateAdminPayload,
  IUpdateAdminPayload,
} from "@/types/admin.types";

export const getAdmins = async () => httpClient.get<IAdmin[]>("/admins");

export const getAdminById = async (id: string) =>
  httpClient.get<IAdmin>(`/admins/${encodeURIComponent(id)}`);

export const createAdmin = async (payload: ICreateAdminPayload) => {
  try {
    return {
      success: true as const,
      response: await httpClient.post<IAdmin>("/admins", payload),
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return {
          success: false as const,
          message: "This email is already in use. Please use a different email address.",
        };
      }

      const responseData = error.response?.data as
        | {
            message?: string;
            errorSources?: Array<{ path?: string; message: string }>;
          }
        | undefined;
      const validationMessage = responseData?.errorSources
        ?.map(({ path, message }) => (path ? `${path}: ${message}` : message))
        .join(". ");

      return {
        success: false as const,
        message:
          validationMessage ??
          responseData?.message ??
          error.message ??
          "Admin creation failed",
      };
    }

    console.error("Unexpected error creating admin:", error);
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Admin creation failed",
    };
  }
};

export const updateAdmin = async (
  id: string,
  payload: IUpdateAdminPayload,
) =>
  httpClient.patch<IAdmin>(
    `/admins/${encodeURIComponent(id)}`,
    payload,
  );

export const deleteAdmin = async (id: string) =>
  httpClient.delete<IAdmin>(`/admins/${encodeURIComponent(id)}`);
