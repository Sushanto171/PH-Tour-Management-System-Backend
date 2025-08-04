import { startSession } from "mongoose";
import { updateDBwithRollbackSessionSslCallback } from "../../utils/updateDBwithRollbackSessionSslCallback";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { PAYMENT_STATUS } from "./payment.interface";

const successPayment = async (query: Record<string, string>) => {
  const session = await startSession();
  try {
    session.startTransaction();
    await updateDBwithRollbackSessionSslCallback(
      query,
      BOOKING_STATUS.CONFIRM,
      PAYMENT_STATUS.PAID,
      session
    );
    await session.commitTransaction();
    return {
      success: true,
      message: "Payment success",
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await startSession();
  try {
    session.startTransaction();
    await updateDBwithRollbackSessionSslCallback(
      query,
      BOOKING_STATUS.CANCELED,
      PAYMENT_STATUS.CANCELLED,
      session
    );
    await session.commitTransaction();
    return {
      cancel: true,
      message: "Payment canceled",
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await startSession();
  try {
    session.startTransaction();
    await updateDBwithRollbackSessionSslCallback(
      query,
      BOOKING_STATUS.FAILED,
      PAYMENT_STATUS.FAILED,
      session
    );
    await session.commitTransaction();
    return {
      fail: true,
      message: "Payment failed.",
    };
    await session.commitTransaction();
    return {};
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const paymentService = {
  successPayment,
  cancelPayment,
  failPayment,
};
