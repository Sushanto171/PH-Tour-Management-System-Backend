import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";

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
  if (response.cancel) {
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
  if (response.fail) {
    res.redirect(
      `${envVars.SSL.SSL_FRONTEND_FAIL_URL}?transactionId=${query.transactionId}&message=${response.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

export const paymentController = {
  successPayment,
  cancelPayment,
  failPayment,
};
