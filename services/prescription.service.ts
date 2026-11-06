"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface AdminPrescription {
  id: string;
  followUpDate: string;
  instructions: string;
  createdAt: string;
  appointmentId: string;
  doctorId: string;
  doctor?: {
    id: string;
    name: string;
  } | null;
  patient?: {
    id: string;
    name: string;
  } | null;
  appointment?: {
    patient?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export interface CreatePrescriptionPayload {
  appointmentId: string;
  followUpDate: string;
  instructions: string;
}

export const createPrescription = async (
  payload: CreatePrescriptionPayload,
): Promise<void> => {
  try {
    await httpClient.post("/prescriptions/create-prescription", payload);
  } catch (error) {
    console.error("Error creating prescription:", error);
    throw error;
  }
};

export const getAdminPrescriptions = async (): Promise<AdminPrescription[]> => {
  try {
    const response = await httpClient.get<AdminPrescription[]>(
      "/prescriptions/all-prescriptions",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching admin prescriptions:", error);
    throw error;
  }
};
