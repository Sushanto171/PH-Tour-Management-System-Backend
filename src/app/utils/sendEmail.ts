/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import path from "path";
import { envVars } from "../config/env";
import { transporter } from "../config/nodeMail.config";
import { AppError } from "../errorHelpers/AppError";
export interface ISendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  templateName?: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  text,
  templateName,
  templateData,
  attachments,
}: ISendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.NODEMAILER.SMTP_FROM,
      to,
      subject,
      text,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.log("Email sending error", error);
    throw new AppError(500, error.message);
  }
};
