import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService } from "./otp.service";

const sendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  const otp = await OTPService.sendOtp(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP send send successfully.",
    data: otp,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { otp, email } = req.body;
  await OTPService.verifyOtp(otp, email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully.",
    data: null,
  });
});

export const OTPController = {
  sendOTP,
  verifyOTP,
};
