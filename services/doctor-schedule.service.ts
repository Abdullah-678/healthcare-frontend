"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface AdminDoctorSchedule {
  id: string;
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  doctor?: {
    id: string;
    name: string;
  } | null;
  schedule?: {
    id?: string;
    startDateTime: string;
    endDateTime: string;
  } | null;
}

export interface DoctorScheduleSlot {
  scheduleId: string;
  isBooked: boolean;
  schedule: {
    startDateTime: string;
    endDateTime: string;
  };
}

export const addMyDoctorSchedule = async (
  scheduleId: string,
): Promise<void> => {
  try {
    await httpClient.post("/doctor-schedules/create-my-doctor-schedule", {
      scheduleIds: [scheduleId],
    });
  } catch (error) {
    console.error("Error adding doctor schedule:", error);
    throw error;
  }
};

export const getAdminDoctorSchedules = async (): Promise<
  AdminDoctorSchedule[]
> => {
  try {
    const response =
      await httpClient.get<AdminDoctorSchedule[]>("/doctor-schedules");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin doctor schedules:", error);
    throw error;
  }
};
