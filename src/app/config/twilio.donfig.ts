import twilio from "twilio";
import { AppError } from "../errorHelpers/AppError";
import { envVars } from "./env";

export const twilioClient = twilio(
  envVars.TWILIO.TWILIO_ACCOUNT_SIID,
  envVars.TWILIO.TWILIO_AUTH_TOKEN
);

export const sendMessage = async (to: string, otp: string) => {
  try {
    const res = await twilioClient.messages.create({
      body: `Your OTP Code: ${otp}`,
      from: '+12015551234',
      to: to,
    });
    return res;
  } catch (error) {
    console.log("Send message error", error);
    throw new AppError(401, "Send message error");
  }
};
