import { ClientSession } from "mongoose";
import { BOOKING_STATUS } from "../modules/booking/booking.interface";
import { Booking } from "../modules/booking/booking.mode";
import { PAYMENT_STATUS } from "../modules/payment/payment.interface";
import { Payment } from "../modules/payment/payment.model";

export const updateDBwithRollbackSessionSslCallback = async (
  query: Record<string, string>,
  bookingStatus: BOOKING_STATUS,
  paymentStatus: PAYMENT_STATUS,
  session: ClientSession
) => {
  try {
    // update payment status
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: paymentStatus },
      { session, runValidators: true }
    );
    // update booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: bookingStatus },
      { session, runValidators: true, new: true }
    )
      .populate("user", ["name", "email", "address"])
      .populate("tour", ["title", "costFrom", "description"]);
    return updatedBooking;
  } catch (error) {
    return error;
  }
};
