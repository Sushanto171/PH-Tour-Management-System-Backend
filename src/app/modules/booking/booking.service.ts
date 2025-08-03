import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { AppError } from "../../errorHelpers/AppError";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ITour } from "../tour/tour.interface";
import { Tour } from "../tour/tour.model";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { QueryBuilder } from "./../../utils/QueryBuilder";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.mode";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random()) * 1000}`;
};

const createBooking = async (
  payload: Partial<IBooking>,
  userId: Types.ObjectId
) => {
  const transactionId = getTransactionId();
  const user = (await User.findById(userId)) as IUser;
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not found.");
  }
  if (!user.address || !user.phone) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Update Your Profile to Book a tour."
    );
  }
  const tour = (await Tour.findById(payload.tour).select("costFrom ")) as ITour;
  if (!tour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Tour Id.");
  }
  const booking = await Booking.create({
    user: user._id,
    status: BOOKING_STATUS.PENDING,
    ...payload,
  });
  const amount = Number(payload.guestCount) * Number(tour.costFrom);
  const payment = await Payment.create({
    transactionId,
    amount,
    status: PAYMENT_STATUS.UNPAID,
    booking: booking._id,
  });

  const updatedBooking = await Booking.findByIdAndUpdate(
    booking._id,
    {
      payment: payment._id,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("user", "name email address phone -_id")
    .populate("tour", "title description costFrom -_id")
    .populate("payment", "status amount -_id ");
  return updatedBooking;
};

const getAllBookings = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Booking.find(),
    query as Record<string, string>
  );
  const bookings = await queryBuilder
    .filter()
    .search(["status"])
    .fields()
    .paginate()
    .build()
    .populate("user", "name email address phone -_id")
    .populate("tour", "title description costFrom -_id")
    .populate("payment", "status amount -_id ");
  const getMeta = await queryBuilder.getMeta();
  const [data, meta] = await Promise.all([bookings, getMeta]);
  return {
    data,
    meta,
  };
};

const getMyBookings = async () => {
  return;
};

const getBookingById = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Booking Id.");
  }
  return booking;
};

const updateBookingStatus = async (bookingId: string) => {
  return;
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
};
