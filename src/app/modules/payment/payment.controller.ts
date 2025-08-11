import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { sslCommerzService } from "../sslCommerz/sslCommerz.service";
import { paymentService } from "./payment.service";

const initPayment = catchAsync(async (req, res) => {
  const bookingId = req.params.bookingId;
  const response = await paymentService.initPayment(bookingId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "InitPayment",
    data: response,
  });
});

const successPayment = catchAsync(async (req, res) => {
  const query = req.query;
  const response = await paymentService.successPayment(
    query as Record<string, string>
  );
  if (response.success) {
    res.redirect(
      `${envVars.SSL.SSL_FRONTEND_SUCCESS_URL}?transactionId=${query.transactionId}&message=${response.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const cancelPayment = catchAsync(async (req, res) => {
  const query = req.query;
  const response = await paymentService.cancelPayment(
    query as Record<string, string>
  );
  if (response.success) {
    res.redirect(
      `${envVars.SSL.SSL_FRONTEND_CANCEL_URL}?transactionId=${query.transactionId}&message=${response.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const failPayment = catchAsync(async (req, res) => {
  const query = req.query;
  const response = await paymentService.failPayment(
    query as Record<string, string>
  );
  if (response.success) {
    res.redirect(
      `${envVars.SSL.SSL_FRONTEND_FAIL_URL}?transactionId=${query.transactionId}&message=${response.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const getInvoiceUrl = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { userId } = req.user as JwtPayload;
  const invoice = await paymentService.getInvoiceUrl(
    userId,
    paymentId as string
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Invoice url retrieved successfully.",
    data: invoice,
  });
});

const validatePayment = catchAsync(async (req, res) => {
  console.log("sslcommerz ipn url body:", req.body);
  await sslCommerzService.validatePayment(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment validate successfully.",
    data: null,
  });
});

export const paymentController = {
  initPayment,
  successPayment,
  cancelPayment,
  failPayment,
  getInvoiceUrl,
  validatePayment,
};
