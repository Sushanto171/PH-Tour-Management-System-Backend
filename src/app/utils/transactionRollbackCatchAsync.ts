import { startSession } from "mongoose";
import { BOOKING_STATUS } from "../modules/booking/booking.interface";
import { PAYMENT_STATUS } from "../modules/payment/payment.interface";
import { updateDBwithRollbackSessionSslCallback } from "./updateDBwithRollbackSessionSslCallback";

interface ReturnMessage {
  status: boolean ;
  message: "Payment success" | "Payment cancel" | "Payment failed";
}

export const transactionRollbackCatchAsync =
  (
    bookingStatus: BOOKING_STATUS,
    paymentStatus: PAYMENT_STATUS,
    returnMessage: ReturnMessage
  ) =>
  async (query: Record<string, string>) => {
    const session = await startSession();
    try {
      session.startTransaction();
      await updateDBwithRollbackSessionSslCallback(
        query,
        bookingStatus,
        paymentStatus,
        session
      );

      await session.commitTransaction();
      return {
        success: true,
        message: returnMessage.message,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      console.log("end.......");
      await session.endSession();
    }
  };
