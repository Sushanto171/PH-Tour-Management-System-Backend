/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import { AppError } from "../../errorHelpers/AppError";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "./sslCommerz.interface";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVars.SSL.SSL_STORE_ID,
      store_passwd: envVars.SSL.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${envVars.SSL.SSL_BACKEND_SUCCESS_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      cancel_url: `${envVars.SSL.SSL_BACKEND_CANCEL_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=canceled`,
      fail_url: `${envVars.SSL.SSL_BACKEND_FAIL_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=failed`,
      ipn_url: envVars.SSL.SSL_IPN_URL,
      shipping_method: "N/A",
      product_name: "Tour",
      product_category: "Service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };
    const response = await axios({
      method: "POST",
      url: envVars.SSL.SSL_PAYMENT_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${envVars.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.SSL_STORE_ID}&store_passwd=${envVars.SSL.SSL_STORE_PASS}`,
    });
    console.log("ssl Payment validation response:", response.data);
    await Payment.findOneAndUpdate(
      { transactionId: response.data.tran_id },
      { paymentGatewayData: response.data },
      {
        runValidators: true,
      }
    );
  } catch (error: any) {
    console.log("Payment validation error:", error.message);
    throw new AppError(500, "Payment validation error");
  }
};

export const sslCommerzService = {
  sslPaymentInit,
  validatePayment,
};
