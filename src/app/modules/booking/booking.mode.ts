import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tour: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Tour",
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    guestCount: {
      type: Number,
      required: true,
    },
    address: { type: String },
    phone: { type: Number },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Booking = model<IBooking>("Booking", bookingSchema);
