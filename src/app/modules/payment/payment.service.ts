/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { transactionRollbackCatchAsync } from "../../utils/transactionRollbackCatchAsync";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.mode";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslCommerzService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found.");
  }
  const booking = await Booking.findById(payment.booking);
  const sslPayload: ISSLCommerz = {
    name: (booking?.user as any).name,
    email: (booking?.user as any).email,
    address: (booking?.user as any).address,
    phoneNumber: (booking?.user as any).phone,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };
  const gateWayPayment = await sslCommerzService.sslPaymentInit(sslPayload);
  return {
    paymentUrl: gateWayPayment.GatewayPageURL,
  };
};

// const successPayment = async (query: Record<string, string>) => {
//   const session = await startSession();
//   try {
//     session.startTransaction();
//     await updateDBwithRollbackSessionSslCallback(
//       query,
//       BOOKING_STATUS.CONFIRM,
//       PAYMENT_STATUS.PAID,
//       session
//     );
//     await session.commitTransaction();
//     return {
//       success: true,
//       message: "Payment success",
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     await session.endSession();
//   }
// };

const successPayment = transactionRollbackCatchAsync(
  BOOKING_STATUS.CONFIRM,
  PAYMENT_STATUS.PAID,
  { status: true, message: "Payment success" }
);

const cancelPayment = transactionRollbackCatchAsync(
  BOOKING_STATUS.CANCELED,
  PAYMENT_STATUS.CANCELLED,
  { status: false, message: "Payment cancel" }
);

const failPayment = transactionRollbackCatchAsync(
  BOOKING_STATUS.FAILED,
  PAYMENT_STATUS.FAILED,
  { status: false, message: "Payment failed" }
);

// const cancelPayment = async (query: Record<string, string>) => {
//   const session = await startSession();
//   try {
//     session.startTransaction();
//     await updateDBwithRollbackSessionSslCallback(
//       query,
//       BOOKING_STATUS.CANCELED,
//       PAYMENT_STATUS.CANCELLED,
//       session
//     );
//     await session.commitTransaction();
//     return {
//       cancel: true,
//       message: "Payment canceled",
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     await session.endSession();
//   }
// };

// const failPayment = async (query: Record<string, string>) => {
//   const session = await startSession();
//   try {
//     session.startTransaction();
//     await updateDBwithRollbackSessionSslCallback(
//       query,
//       BOOKING_STATUS.FAILED,
//       PAYMENT_STATUS.FAILED,
//       session
//     );
//     await session.commitTransaction();
//     return {
//       fail: true,
//       message: "Payment failed.",
//     };
//     await session.commitTransaction();
//     return {};
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     await session.endSession();
//   }
// };

export const paymentService = {
  successPayment,
  cancelPayment,
  failPayment,
  initPayment,
};
