"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateZodSchema_1 = require("../../middlewares/validateZodSchema");
const user_interface_1 = require("../user/user.interface");
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const router = (0, express_1.Router)();
// /api/v1/booking
router.post("/", (0, validateZodSchema_1.validateRequest)(booking_validation_1.createBookingZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), booking_controller_1.BookingController.createBooking);
// /api/v1/booking/my-bookings
router.get("/my-bookings", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), booking_controller_1.BookingController.getMyBookings);
// /api/v1/booking/:bookingId
router.get("/:bookingId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), booking_controller_1.BookingController.getBookingById);
// /api/v1/booking
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), booking_controller_1.BookingController.getAllBookings);
// api/v1/booking/:bookingId/status
router.patch("/:bookingId/status", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), booking_controller_1.BookingController.updateBookingStatus);
exports.BookingRoutes = router;
