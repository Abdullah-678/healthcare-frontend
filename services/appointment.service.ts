"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface Appointment {
  id: string;
  videoCallingId: string;
  status: string;
  paymentStatus?: string | null;
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

export interface AdminAppointment {
  id: string;
  status: string;
  paymentStatus?: string | null;
  createdAt: string;
  patient?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  doctor?: {
    id: string;
    name: string;
    specialization?: string;
    appointmentFee?: number;
  } | null;
  schedule?: {
    id?: string;
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

export type DoctorAppointmentStatus = "INPROGRESS" | "COMPLETED";

interface CreateAppointmentResponse {
  paymentUrl: string | null;
  requestPending: boolean;
}

interface InitiatePaymentResponse {
  paymentUrl: string | null;
}

interface AppointmentPaymentStatusResponse {
  paymentStatus: string;
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

export const initiateAppointmentPayment = async (
  appointmentId: string,
): Promise<string> => {
  try {
    const response = await httpClient.post<InitiatePaymentResponse>(
      `/appointments/initiate-payment/${encodeURIComponent(appointmentId)}`,
      {},
    );

    if (!response.data.paymentUrl) {
      throw new Error("The payment provider did not return a checkout URL.");
    }

    return response.data.paymentUrl;
  } catch (error) {
    console.error("Error initiating appointment payment:", error);
    throw error;
  }
};

export const getAppointmentPaymentStatus = async (
  appointmentId: string,
  sessionId?: string,
): Promise<string> => {
  try {
    const response = await httpClient.get<AppointmentPaymentStatusResponse>(
      `/appointments/payment-status/${encodeURIComponent(appointmentId)}`,
      { params: sessionId ? { session_id: sessionId } : undefined },
    );
    return response.data.paymentStatus;
  } catch (error) {
    console.error("Error checking appointment payment status:", error);
    throw error;
  }
};

export const updateDoctorAppointmentStatus = async (
  appointmentId: string,
  status: DoctorAppointmentStatus,
): Promise<void> => {
  try {
    await httpClient.patch(
      `/appointments/change-appointment-status/${encodeURIComponent(appointmentId)}`,
      { status },
    );
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

export const scheduleAppointmentRequest = async (
  appointmentId: string,
  scheduleId: string,
): Promise<void> => {
  try {
    await httpClient.patch(
      `/appointments/schedule-request/${encodeURIComponent(appointmentId)}`,
      { scheduleId },
    );
  } catch (error) {
    console.error("Error scheduling appointment request:", error);
    throw error;
  }
};

export const getAdminAppointments = async (): Promise<AdminAppointment[]> => {
  try {
    const response = await httpClient.get<AdminAppointment[]>(
      "/appointments/all-appointments",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching admin appointments:", error);
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
