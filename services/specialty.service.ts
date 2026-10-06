"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface ISpecialty {
  id: string;
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
