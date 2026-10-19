"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface PatientPrescription {
  id: string;
  followUpDate: string;
  instructions: string;
  createdAt: string;
  appointmentId: string;
  doctorId: string;
}

export interface PatientMedicalReport {
  id: string;
  reportName: string;
  reportLink: string;
  createdAt: string;
}

export interface PatientHealthData {
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  hasAllergies: boolean;
  hasDiabetes: boolean;
  height: string;
  weight: string;
  smokingStatus: boolean;
  dietaryPreferences: string | null;
  pregnancyStatus: boolean;
  mentalHealthHistory: string | null;
  immunizationStatus: string | null;
  hasPastSurgeries: boolean;
  recentAnxiety: boolean;
  recentDepression: boolean;
  maritalStatus: string | null;
  updatedAt: string;
}

interface PatientRecordResponse {
  patient: {
    prescriptions: PatientPrescription[];
    medicalReports: PatientMedicalReport[];
    patientHealthData: PatientHealthData | null;
  } | null;
}

export const getMyPatientRecords = async (): Promise<PatientRecordResponse> => {
  try {
    const response =
      await httpClient.get<PatientRecordResponse>("/auth/me");

    return response.data;
  } catch (error) {
    console.error("Error fetching patient records:", error);
    throw error;
  }
};
