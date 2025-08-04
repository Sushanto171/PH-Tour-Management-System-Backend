import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateZodSchema";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";
import { createBookingZodSchema } from "./booking.validation";

const router = Router();

// /api/v1/booking
router.post(
  "/",
  validateRequest(createBookingZodSchema),
  checkAuth(...Object.values(Role)),
  BookingController.createBooking
);

// /api/v1/booking/my-bookings
router.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  BookingController.getMyBookings
);

// /api/v1/booking/:bookingId
router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  BookingController.getBookingById
);

// /api/v1/booking
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getAllBookings
);

// api/v1/booking/:bookingId/status
router.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(Role)),
  BookingController.updateBookingStatus
);

export const BookingRoutes = router;
