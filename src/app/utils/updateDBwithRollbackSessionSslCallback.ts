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
      { status: PAYMENT_STATUS.PAID },
      { session }
    );
    // update booking status
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: bookingStatus },
      { session }
    );
  } catch (error) {
    return error;
  }
};
