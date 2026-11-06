"use server";

import axios from "axios";
import { httpClient } from "@/lib/axios/httpClient";
import {
  ICreateDoctorPayload,
  IDoctor,
  IUpdateDoctorPayload,
} from "@/types/doctor.types";

type DoctorMutationResult =
  | { success: true }
  | { success: false; message: string };

const getMutationErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 409) {
      return "This email is already in use. Please use a different email address.";
    }

    const data = error.response?.data as
      | {
          message?: string;
          errorSources?: Array<{ path?: string; message: string }>;
        }
      | undefined;
    const validationMessage = data?.errorSources
      ?.map(({ path, message }) => (path ? `${path}: ${message}` : message))
      .join(". ");

    return validationMessage || data?.message || error.message;
  }

  return error instanceof Error ? error.message : "Unexpected error";
};

export const getDoctors = async () => {
  try {
    const doctors = await httpClient.get<IDoctor[]>("/doctors");
    return doctors;
  } catch (error) {
    console.log("Error fetching doctors:", error);
    throw error;
  }
};

export const deleteDoctor = async (id: string) => {
  try {
    const response = await httpClient.delete(`/doctors/${encodeURIComponent(id)}`);
    return response;
  } catch (error) {
    console.log("Error deleting doctor:", error);
    throw error;
  }
};

export const getDoctorById = async (id: string) => {
  try {
    const doctor = await httpClient.get<IDoctor>(
      `/doctors/${encodeURIComponent(id)}`,
    );
    return doctor;
  } catch (error) {
    console.log("Error fetching doctor:", error);
    throw error;
  }
};

export const updateDoctor = async (
  id: string,
  data: IUpdateDoctorPayload,
): Promise<DoctorMutationResult> => {
  try {
    await httpClient.put<IDoctor>(
      `/doctors/${encodeURIComponent(id)}`,
      data,
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: getMutationErrorMessage(error) };
  }
};

export const createDoctor = async (
  data: ICreateDoctorPayload,
): Promise<DoctorMutationResult> => {
  try {
    await httpClient.post<IDoctor>("/users/create-doctor", data);
    return { success: true };
  } catch (error) {
    return { success: false, message: getMutationErrorMessage(error) };
  }
};
