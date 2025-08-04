import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req, res) => {
  const decoded = req.user as JwtPayload;
  const booking = await bookingService.createBooking(req.body, decoded.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully.",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const { data, meta } = await bookingService.getAllBookings(
    req.query as Record<string, string>
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking retrieved success.",
    data,
    meta,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "",
    data: null,
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const booking = await bookingService.getBookingById(bookingId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking retrieved successfully.",
    data: booking,
  });
});

const updateBookingStatus = catchAsync(async (req, res) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "",
    data: null,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
};
