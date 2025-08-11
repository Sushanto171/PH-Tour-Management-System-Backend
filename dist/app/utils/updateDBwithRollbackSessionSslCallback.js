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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDBwithRollbackSessionSslCallback = void 0;
const booking_mode_1 = require("../modules/booking/booking.mode");
const payment_model_1 = require("../modules/payment/payment.model");
const updateDBwithRollbackSessionSslCallback = (query, bookingStatus, paymentStatus, session) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // update payment status
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: paymentStatus }, { session, runValidators: true });
        // update booking status
        const updatedBooking = yield booking_mode_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: bookingStatus }, { session, runValidators: true, new: true })
            .populate("user", ["name", "email", "address"])
            .populate("tour", ["title", "costFrom", "description"]);
        return updatedBooking;
    }
    catch (error) {
        return error;
    }
});
exports.updateDBwithRollbackSessionSslCallback = updateDBwithRollbackSessionSslCallback;
