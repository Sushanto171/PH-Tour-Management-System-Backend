import { Types } from "mongoose";

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount?: number;
  phone?: string;
  address?: string;
  status?: "Pending" | "Completed" | "Rejected" | "Cancel";
}
