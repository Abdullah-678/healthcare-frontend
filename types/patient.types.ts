import { UserStatus } from "./doctor.types";

export interface IPatient {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: "PATIENT";
    status: UserStatus;
    emailVerified: boolean;
    createdAt: string;
  };
}

export interface ICreatePatientPayload {
  password: string;
  patient: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
  };
}

export interface IUpdatePatientPayload {
  patient: {
    name: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
  };
}
