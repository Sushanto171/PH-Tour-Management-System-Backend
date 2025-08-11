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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const nodeMail_config_1 = require("../config/nodeMail.config");
const AppError_1 = require("../errorHelpers/AppError");
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, text, templateName, templateData, attachments, }) {
    try {
        const templatePath = path_1.default.join(__dirname, `templates/${templateName}.ejs`);
        const html = yield ejs_1.default.renderFile(templatePath, templateData);
        const info = yield nodeMail_config_1.transporter.sendMail({
            from: env_1.envVars.NODEMAILER.SMTP_FROM,
            to,
            subject,
            text,
            html,
            attachments: attachments === null || attachments === void 0 ? void 0 : attachments.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.log("Email sending error", error);
        throw new AppError_1.AppError(500, error.message);
    }
});
exports.sendEmail = sendEmail;
