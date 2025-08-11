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
exports.paymentController = void 0;
const env_1 = require("../../config/env");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const response = yield payment_service_1.paymentService.initPayment(bookingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "InitPayment",
        data: response,
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const response = yield payment_service_1.paymentService.successPayment(query);
    if (response.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_FRONTEND_SUCCESS_URL}?transactionId=${query.transactionId}&message=${response.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const response = yield payment_service_1.paymentService.cancelPayment(query);
    if (response.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_FRONTEND_CANCEL_URL}?transactionId=${query.transactionId}&message=${response.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const response = yield payment_service_1.paymentService.failPayment(query);
    if (response.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_FRONTEND_FAIL_URL}?transactionId=${query.transactionId}&message=${response.message}&amount=${query.amount}&status=${query.status}`);
    }
}));
const getInvoiceUrl = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.params;
    const { userId } = req.user;
    const invoice = yield payment_service_1.paymentService.getInvoiceUrl(userId, paymentId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Invoice url retrieved successfully.",
        data: invoice,
    });
}));
const validatePayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("sslcommerz ipn url body:", req.body);
    yield sslCommerz_service_1.sslCommerzService.validatePayment(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Payment validate successfully.",
        data: null,
    });
}));
exports.paymentController = {
    initPayment,
    successPayment,
    cancelPayment,
    failPayment,
    getInvoiceUrl,
    validatePayment,
};
