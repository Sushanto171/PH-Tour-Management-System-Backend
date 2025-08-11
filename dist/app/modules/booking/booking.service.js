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
exports.bookingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = require("../../errorHelpers/AppError");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const tour_model_1 = require("../tour/tour.model");
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = require("./../../utils/QueryBuilder");
const booking_interface_1 = require("./booking.interface");
const booking_mode_1 = require("./booking.mode");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // generate transaction id
    const transactionId = getTransactionId();
    // generate virtual sandbox
    const session = yield booking_mode_1.Booking.startSession();
    try {
        session.startTransaction();
        // get current user
        const user = (yield user_model_1.User.findById(userId));
        if (!user) {
            throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User does not found.");
        }
        if (!user.address || !user.phone) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Please Update Your Profile to Book a tour.");
        }
        // get tour by tour id
        const tour = (yield tour_model_1.Tour.findById(payload.tour).select("costFrom "));
        if (!tour.costFrom) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Invalid Tour Id.");
        }
        // create booking
        const booking = yield booking_mode_1.Booking.create([
            Object.assign({ user: user._id, status: booking_interface_1.BOOKING_STATUS.PENDING }, payload),
        ], { session });
        // create payment
        const amount = Number(payload.guestCount) * Number(tour.costFrom);
        const payment = yield payment_model_1.Payment.create([
            {
                transactionId,
                amount,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                booking: booking[0]._id,
            },
        ], { session });
        // update payment id in booking collection
        const updatedBooking = yield booking_mode_1.Booking.findByIdAndUpdate(booking[0]._id, {
            payment: payment[0]._id,
        }, {
            new: true,
            runValidators: true,
            session,
        })
            .populate("user", "name email address phone -_id")
            .populate("tour", "title description costFrom -_id")
            .populate("payment", "status amount -_id transactionId");
        if (!updatedBooking) {
            throw new AppError_1.AppError(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to update booking.");
        }
        const sslPayload = {
            name: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name,
            email: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email,
            address: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).address,
            phoneNumber: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).phone,
            amount,
            transactionId,
        };
        const sslPayment = yield sslCommerz_service_1.sslCommerzService.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking,
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
const getAllBookings = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(booking_mode_1.Booking.find(), query);
    const bookings = yield queryBuilder
        .filter()
        .search(["status"])
        .fields()
        .paginate()
        .build()
        .populate("user", "name email address phone -_id")
        .populate("tour", "title description costFrom -_id")
        .populate("payment", "status amount -_id ");
    const getMeta = yield queryBuilder.getMeta();
    const [data, meta] = yield Promise.all([bookings, getMeta]);
    return {
        data,
        meta,
    };
});
const getMyBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return;
});
const getBookingById = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_mode_1.Booking.findById(bookingId);
    if (!booking) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Invalid Booking Id.");
    }
    return booking;
});
const updateBookingStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
exports.bookingService = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    updateBookingStatus,
};
