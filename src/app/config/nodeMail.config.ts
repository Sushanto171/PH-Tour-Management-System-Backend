import nodeMailer from "nodemailer";
import { envVars } from "./env";

export const transporter = nodeMailer.createTransport({
  host: envVars.NODEMAILER.SMTP_HOST,
  port: Number(envVars.NODEMAILER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.NODEMAILER.SMTP_USER,
    pass: envVars.NODEMAILER.SMTP_PASS,
  },
});
