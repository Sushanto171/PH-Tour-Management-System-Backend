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
  provider: string;
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  picture?: string;
  address?: string;
  isVerified?: string;
  isActive?: IsActive;
  isDeleted?: string;
  role: Role;
  auths: IAuthsProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
