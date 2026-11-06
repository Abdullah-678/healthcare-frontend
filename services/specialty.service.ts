"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface ISpecialty {
  id: string;
  title: string;
}

export interface SpecialtyPayload {
  title: string;
}

export const getSpecialties = async () => {
  try {
    const specialties = await httpClient.get<ISpecialty[]>("/specialties");

    return specialties;
  } catch (error) {
    console.log("Error fetching specialties:", error);
    throw error;
  }
};

export const createSpecialty = async (payload: SpecialtyPayload) => {
  try {
    return await httpClient.post<ISpecialty>("/specialties", payload);
  } catch (error) {
    console.error("Error creating specialty:", error);
    throw error;
  }
};

export const updateSpecialty = async (
  id: string,
  payload: SpecialtyPayload,
) => {
  try {
    return await httpClient.patch<ISpecialty>(
      `/specialties/${encodeURIComponent(id)}`,
      payload,
    );
  } catch (error) {
    console.error("Error updating specialty:", error);
    throw error;
  }
};

export const deleteSpecialty = async (id: string) => {
  try {
    return await httpClient.delete(`/specialties/${encodeURIComponent(id)}`);
  } catch (error) {
    console.error("Error deleting specialty:", error);
    throw error;
  }
};
