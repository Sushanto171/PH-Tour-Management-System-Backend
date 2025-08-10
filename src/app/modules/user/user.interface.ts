import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuthsProvider {
  provider: "google" | "credential";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  picture?: string;
  address?: string;
  isVerified?: boolean;
  isActive?: IsActive;
  isDeleted?: boolean;
  role: Role;
  auths: IAuthsProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
  createdAt?: Date;
}
