"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = require("../../errorHelpers/AppError");
const generatePDF_1 = require("../../utils/generatePDF");
const sendEmail_1 = require("../../utils/sendEmail");
const transactionRollbackCatchAsync_1 = require("../../utils/transactionRollbackCatchAsync");
const updateDBwithRollbackSessionSslCallback_1 = require("../../utils/updateDBwithRollbackSessionSslCallback");
const booking_interface_1 = require("../booking/booking.interface");
const booking_mode_1 = require("../booking/booking.mode");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Payment not found.");
    }
    const booking = yield booking_mode_1.Booking.findById(payment.booking);
    const sslPayload = {
        name: (booking === null || booking === void 0 ? void 0 : booking.user).name,
        email: (booking === null || booking === void 0 ? void 0 : booking.user).email,
        address: (booking === null || booking === void 0 ? void 0 : booking.user).address,
        phoneNumber: (booking === null || booking === void 0 ? void 0 : booking.user).phone,
        amount: payment.amount,
        transactionId: payment.transactionId,
    };
    const gateWayPayment = yield sslCommerz_service_1.sslCommerzService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: gateWayPayment.GatewayPageURL,
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const updatedBooking = (yield (0, updateDBwithRollbackSessionSslCallback_1.updateDBwithRollbackSessionSslCallback)(query, booking_interface_1.BOOKING_STATUS.CONFIRM, payment_interface_1.PAYMENT_STATUS.PAID, session));
        if (!updatedBooking) {
            throw new AppError_1.AppError(404, "Booking does not found.");
        }
        const invoiceData = {
            transactionId: query.transactionId,
            bookingDate: updatedBooking.createdAt,
            userName: updatedBooking.user.name,
            userEmail: updatedBooking.user.email,
            tourTitle: updatedBooking.tour.title,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedBooking.guestCount *
                Number(updatedBooking.tour.costFrom),
            company: {
                name: "PH-Tour Travel Co.",
                address: "House 12, Road 4, Dhanmondi, Dhaka, Bangladesh",
                phone: "+880 1712-345678",
                email: "info@bdtravel.com",
            },
            billingTo: {
                name: updatedBooking.user.name,
                address: updatedBooking.user.address,
                email: updatedBooking.user.email,
            },
            footerText: "Thank you for choosing PH-Tour Travel Co. ",
        };
        const pdfBuffer = yield (0, generatePDF_1.generatePdf)(invoiceData);
        const cloudinaryResponse = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        yield payment_model_1.Payment.findByIdAndUpdate(updatedBooking.payment, { invoiceUrl: cloudinaryResponse === null || cloudinaryResponse === void 0 ? void 0 : cloudinaryResponse.secure_url }, { runValidators: true, session });
        yield (0, sendEmail_1.sendEmail)({
            to: updatedBooking.user.email,
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
        yield session.commitTransaction();
        return {
            success: true,
            message: "Payment success",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        yield session.endSession();
    }
});
// const successPayment = transactionRollbackCatchAsync(
//   BOOKING_STATUS.CONFIRM,
//   PAYMENT_STATUS.PAID,
//   { status: true, message: "Payment success" }
// );
const cancelPayment = (0, transactionRollbackCatchAsync_1.transactionRollbackCatchAsync)(booking_interface_1.BOOKING_STATUS.CANCELED, payment_interface_1.PAYMENT_STATUS.CANCELLED, { status: false, message: "Payment cancel" });
const failPayment = (0, transactionRollbackCatchAsync_1.transactionRollbackCatchAsync)(booking_interface_1.BOOKING_STATUS.FAILED, payment_interface_1.PAYMENT_STATUS.FAILED, { status: false, message: "Payment failed" });
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
const getInvoiceUrl = (userId, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId).populate("booking", [
        "user",
    ]);
    if (!payment) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Payment does not found");
    }
    if (userId !== payment.booking.user.toHexString()) {
        throw new AppError_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "Your are not permitted to show another invoice.");
    }
    return payment.invoiceUrl;
});
exports.paymentService = {
    successPayment,
    cancelPayment,
    failPayment,
    initPayment,
    getInvoiceUrl,
};
