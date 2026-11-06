"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  doctor?: {
    id: string;
    name: string;
  } | null;
  patient?: {
    id?: string;
    name: string;
  } | null;
}

export const getAdminReviews = async (): Promise<AdminReview[]> => {
  try {
    const response = await httpClient.get<AdminReview[]>("/reviews");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    throw error;
  }
};
