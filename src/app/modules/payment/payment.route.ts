import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/init-payment/:bookingId", paymentController.initPayment);
router.post("/success", paymentController.successPayment);
router.post("/cancel", paymentController.cancelPayment);
router.post("/fail", paymentController.failPayment);
router.get(
  "/invoice-url/:paymentId",
  checkAuth(...Object.values(Role)),
  paymentController.getInvoiceUrl
);
router.post("/validate-payment", paymentController.validatePayment);

export const PaymentRoutes = router;
