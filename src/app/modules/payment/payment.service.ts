/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { startSession } from "mongoose";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import { AppError } from "../../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/generatePDF";
import { sendEmail } from "../../utils/sendEmail";
import { transactionRollbackCatchAsync } from "../../utils/transactionRollbackCatchAsync";
import { updateDBwithRollbackSessionSslCallback } from "../../utils/updateDBwithRollbackSessionSslCallback";
import { BOOKING_STATUS, IBooking } from "../booking/booking.interface";
import { Booking } from "../booking/booking.mode";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslCommerzService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
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

const successPayment = async (query: Record<string, string>) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const updatedBooking = (await updateDBwithRollbackSessionSslCallback(
      query,
      BOOKING_STATUS.CONFIRM,
      PAYMENT_STATUS.PAID,
      session
    )) as IBooking;
    if (!updatedBooking) {
      throw new AppError(404, "Booking does not found.");
    }

    const invoiceData: IInvoiceData = {
      transactionId: query.transactionId,
      bookingDate: updatedBooking.createdAt as Date,
      userName: (updatedBooking.user as unknown as IUser).name,
      userEmail: (updatedBooking.user as unknown as IUser).email,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      guestCount: updatedBooking.guestCount,
      totalAmount:
        updatedBooking.guestCount *
        Number((updatedBooking.tour as unknown as ITour).costFrom),
      company: {
        name: "PH-Tour Travel Co.",
        address: "House 12, Road 4, Dhanmondi, Dhaka, Bangladesh",
        phone: "+880 1712-345678",
        email: "info@bdtravel.com",
      },
      billingTo: {
        name: (updatedBooking.user as unknown as IUser).name,
        address: (updatedBooking.user as unknown as IUser).address,
        email: (updatedBooking.user as unknown as IUser).email,
      },
      footerText: "Thank you for choosing PH-Tour Travel Co. ",
    };

    const pdfBuffer = await generatePdf(invoiceData);
    const cloudinaryResponse = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );
    await Payment.findByIdAndUpdate(
      updatedBooking.payment,
      { invoiceUrl: cloudinaryResponse?.secure_url },
      { runValidators: true, session }
    );
    await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Tour Booking invoice",
      templateData: invoiceData,
      templateName: "invoice",
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
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

// const successPayment = transactionRollbackCatchAsync(
//   BOOKING_STATUS.CONFIRM,
//   PAYMENT_STATUS.PAID,
//   { status: true, message: "Payment success" }
// );

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

const getInvoiceUrl = async (userId: string, paymentId: string) => {
  const payment = await Payment.findById(paymentId).populate("booking", [
    "user",
  ]);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment does not found");
  }
  if (userId !== (payment.booking as unknown as IBooking).user.toHexString()) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your are not permitted to show another invoice."
    );
  }
  return payment.invoiceUrl;
};

export const paymentService = {
  successPayment,
  cancelPayment,
  failPayment,
  initPayment,
  getInvoiceUrl,
};
