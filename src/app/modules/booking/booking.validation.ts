import z from "zod/v3";
import { BOOKING_STATUS } from "./booking.interface";

export const createBookingZodSchema = z.object({
  tour: z.string({
    required_error: "Tour id must be required.",
    invalid_type_error: "Tour must be string format",
  }),
  guestCount: z.number().int().positive(),
});

export const updateBookingZodSchema = z.object({
  status: z.enum(Object.values(BOOKING_STATUS) as [string]),
});
