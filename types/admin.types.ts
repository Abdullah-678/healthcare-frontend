import { UserStatus } from "./doctor.types";

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    role: "ADMIN" | "SUPERADMIN";
    status: UserStatus;
    emailVerified: boolean;
    createdAt: string;
  };
}

export interface ICreateAdminPayload {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
}

export interface IUpdateAdminPayload {
  admin: {
    name: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
}
