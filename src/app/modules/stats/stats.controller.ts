import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { statsService } from "./stats.service";

const getUserStats = catchAsync(async (req, res) => {
  const stats = await statsService.getUserStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User stats retrieved successfully.",
    data: stats,
  });
});
const getTourStats = catchAsync(async (req, res) => {
  const stats = await statsService.getTourStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Tour stats retrieved successfully.",
    data: stats,
  });
});
const getBookingStats = catchAsync(async (req, res) => {
  const stats = await statsService.getBookingStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking stats retrieved successfully.",
    data: stats,
  });
});
const getPaymentStats = catchAsync(async (req, res) => {
  const stats = await statsService.getPaymentStats();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment stats retrieved successfully.",
    data: stats,
  });
});

export const statsController = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
