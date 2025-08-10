import crypto from "crypto";
import httpStatus from "http-status-codes";
import { redisClient } from "../../config/redis.config";
import { AppError } from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../user/user.model";
const otpExpiration = 2 * 60; // minutes

const generateOTP = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOtp = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(404, "User does not exit");
  }
  const otp = generateOTP();
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: otpExpiration,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: isUserExist.name,
      otp,
    },
  });

  // if (isUserExist.phone) {
  //   await sendMessage(isUserExist.phone, otp);
  // }

  return {};
};

const verifyOtp = async (otp: string, email: string) => {
  const redisKey = `otp:${email}`;
  const redisOtp = await redisClient.get(redisKey);
  if (!redisOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your OTP is Expired.");
  }
  if (redisOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your OTP is invalid.");
  }
  await Promise.all([
    User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { runValidators: true }
    ),
    redisClient.del(redisKey),
  ]);

  return {};
};

export const OTPService = {
  sendOtp,
  verifyOtp,
};
