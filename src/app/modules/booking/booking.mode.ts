import { model, Schema } from "mongoose";
import { IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    tour: { type: Schema.Types.ObjectId, required: true },
    payment: { type: Schema.Types.ObjectId },
    guestCount: { type: Number },
    address: { type: String },
    phone: { type: Number },
    status: {
      enum: ["Pending", "Completed", "Rejected", "Cancel"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
