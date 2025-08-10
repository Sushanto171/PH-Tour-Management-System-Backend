import { Types } from "mongoose";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  CONFIRM = "CONFIRM",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount: number;
  phone?: string;
  address?: string;
  status?: BOOKING_STATUS;
  createdAt?: Date
}
