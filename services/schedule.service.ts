"use server";

import axios from "axios";
import { httpClient } from "@/lib/axios/httpClient";

export interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulePayload {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

type ScheduleResult<TData = undefined> =
  | { success: true; data: TData }
  | { success: false; message: string };

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
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

export const getSchedules = async (): Promise<ScheduleResult<Schedule[]>> => {
  try {
    const response = await httpClient.get<Schedule[]>("/schedules");
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("Failed to load schedules:", error);
    return { success: false, message: getErrorMessage(error) };
  }
};

export const createSchedules = async (
  payload: SchedulePayload,
): Promise<ScheduleResult<Schedule[]>> => {
  try {
    const response = await httpClient.post<Schedule[]>("/schedules", payload);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("Failed to create schedules:", error);
    return { success: false, message: getErrorMessage(error) };
  }
};

export const updateSchedule = async (
  id: string,
  payload: SchedulePayload,
): Promise<ScheduleResult<Schedule>> => {
  try {
    const response = await httpClient.patch<Schedule>(
      `/schedules/${encodeURIComponent(id)}`,
      payload,
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    console.error("Failed to update schedule:", error);
    return { success: false, message: getErrorMessage(error) };
  }
};

export const deleteSchedule = async (
  id: string,
): Promise<ScheduleResult> => {
  try {
    await httpClient.delete(`/schedules/${encodeURIComponent(id)}`);
    return { success: true, data: undefined };
  } catch (error: unknown) {
    console.error("Failed to delete schedule:", error);
    return { success: false, message: getErrorMessage(error) };
  }
};
