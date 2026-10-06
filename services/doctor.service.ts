"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ICreateDoctorPayload, IDoctor } from "@/types/doctor.types";

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
    const response = await httpClient.delete(`/doctors/${id}`);
    return response;
  } catch (error) {
    console.log("Error deleting doctor:", error);
    throw error;
  }
};

export const getDoctorById = async (id: string) => {
  try {
    const doctor = await httpClient.get<IDoctor>(`/doctors/${id}`);
    return doctor;
  } catch (error) {
    console.log("Error fetching doctor:", error);
    throw error;
  }
};

export const updateDoctor = async (id: string, data: Partial<IDoctor>) => {
  try {
    const doctor = await httpClient.put<IDoctor>(`/doctors/${id}`, data);

    return doctor;
  } catch (error) {
    console.log("Error updating doctor:", error);
    throw error;
  }
};

export const createDoctor = async (data: ICreateDoctorPayload) => {
  try {
    const doctor = await httpClient.post<IDoctor>("/users/create-doctor", data);

    return doctor;
  } catch (error) {
    console.log("Error creating doctor:", error);
    throw error;
  }
};
