"use server";

import axios from "axios";
import { httpClient } from "@/lib/axios/httpClient";
import {
  ICreatePatientPayload,
  IPatient,
  IUpdatePatientPayload,
} from "@/types/patient.types";

export const getPatients = async () => httpClient.get<IPatient[]>("/patients");

export const getPatientById = async (id: string) =>
  httpClient.get<IPatient>(`/patients/${encodeURIComponent(id)}`);

export const createPatient = async (payload: ICreatePatientPayload) => {
  try {
    return {
      success: true as const,
      response: await httpClient.post<IPatient>("/patients", payload),
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
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
        success: false,
        message:
          validationMessage ??
          responseData?.message ??
          error.message ??
          "Patient creation failed",
      };
    }

    console.error("Unexpected error creating patient:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Patient creation failed",
    };
  }
};

export const updatePatient = async (
  id: string,
  payload: IUpdatePatientPayload,
) => httpClient.patch<IPatient>(`/patients/${encodeURIComponent(id)}`, payload);

export const deletePatient = async (id: string) =>
  httpClient.delete<IPatient>(`/patients/${encodeURIComponent(id)}`);
