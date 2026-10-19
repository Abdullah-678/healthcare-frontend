"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface Appointment {
  id: string;
  videoCallingId: string;
  status: string;
  doctor: {
    id: string;
    name: string;
    specialization: string;
    appointmentFee: number;
  };
  schedule: {
    id: string;
    startDateTime: string;
    endDateTime: string;
  } | null;
}

export interface BookableDoctor {
  id: string;
  name: string;
  appointmentFee: number;
  specialties: Array<{
    specialty: {
      title: string;
    };
  }>;
}

export interface BookableSchedule {
  scheduleId: string;
  schedule: {
    startDateTime: string;
    endDateTime: string;
  };
}

export interface CreateAppointmentPayload {
  doctorId: string;
  scheduleId?: string;
}

interface CreateAppointmentResponse {
  paymentUrl: string | null;
  requestPending: boolean;
}

export const getBookableDoctors = async (): Promise<BookableDoctor[]> => {
  try {
    const response = await httpClient.get<BookableDoctor[]>("/doctors");
    return response.data;
  } catch (error) {
    console.error("Error fetching bookable doctors:", error);
    throw error;
  }
};

export const getBookableSchedules = async (
  doctorId: string,
): Promise<BookableSchedule[]> => {
  try {
    const response = await httpClient.get<BookableSchedule[]>(
      `/doctor-schedules/available/${doctorId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bookable schedules:", error);
    throw error;
  }
};

export const getMyAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await httpClient.get<Appointment[]>(
      "/appointments/my-appointments",
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const createAppointment = async (
  payload: CreateAppointmentPayload,
): Promise<CreateAppointmentResponse> => {
  try {
    const response = await httpClient.post<CreateAppointmentResponse>(
      "/appointments/book-appointment",
      payload,
    );

    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};
