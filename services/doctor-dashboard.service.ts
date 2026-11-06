"use server";

import { httpClient } from "@/lib/axios/httpClient";
import axios from "axios";
import { cookies } from "next/headers";

export interface DoctorDashboardAppointment {
  id: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  patient: {
    id: string;
    name: string;
  };
  schedule: {
    startDateTime: string;
    endDateTime: string;
  } | null;
}

export interface DoctorDashboardReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  patient: {
    name: string;
  };
}

export interface DoctorDashboardSchedule {
  scheduleId: string;
  isBooked: boolean;
  schedule: {
    startDateTime: string;
    endDateTime: string;
  };
}

export interface DoctorDashboardProfile {
  name: string;
  designation: string;
  currentWorkingPlace: string;
  appointmentFee: number;
  averageRating: number;
  specialties: Array<{
    specialty?: {
      title: string | null;
    } | null;
  }>;
}

interface AuthUserResponse {
  doctor: DoctorDashboardProfile | null;
}

export interface DoctorDashboardData {
  profile: DoctorDashboardProfile | null;
  appointments: DoctorDashboardAppointment[];
  reviews: DoctorDashboardReview[];
  schedules: DoctorDashboardSchedule[];
}

export const getDoctorDashboardData =
  async (): Promise<DoctorDashboardData> => {
    try {
      const cookieStore = await cookies();
      if (
        !cookieStore.get("accessToken")?.value ||
        !cookieStore.get("better-auth.session_token")?.value
      ) {
        return {
          profile: null,
          appointments: [],
          reviews: [],
          schedules: [],
        };
      }

      const [userResponse, appointmentsResponse, reviewsResponse, schedulesResponse] =
        await Promise.all([
          httpClient.get<AuthUserResponse>("/auth/me"),
          httpClient.get<DoctorDashboardAppointment[]>(
            "/appointments/my-appointments",
          ),
          httpClient.get<DoctorDashboardReview[]>("/reviews/my-reviews"),
          httpClient.get<DoctorDashboardSchedule[]>(
            "/doctor-schedules/my-doctor-schedules",
          ),
        ]);

      return {
        profile: userResponse.data.doctor,
        appointments: appointmentsResponse.data,
        reviews: reviewsResponse.data,
        schedules: schedulesResponse.data,
      };
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        console.warn("Doctor dashboard data is unavailable because the session is unauthenticated.");
        return {
          profile: null,
          appointments: [],
          reviews: [],
          schedules: [],
        };
      }

      console.error("Error fetching doctor dashboard data:", error);
      return {
        profile: null,
        appointments: [],
        reviews: [],
        schedules: [],
      };
    }
  };
