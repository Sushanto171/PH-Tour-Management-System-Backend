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
exports.sendMessage = exports.twilioClient = void 0;
const twilio_1 = __importDefault(require("twilio"));
const AppError_1 = require("../errorHelpers/AppError");
const env_1 = require("./env");
exports.twilioClient = (0, twilio_1.default)(env_1.envVars.TWILIO.TWILIO_ACCOUNT_SIID, env_1.envVars.TWILIO.TWILIO_AUTH_TOKEN);
const sendMessage = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield exports.twilioClient.messages.create({
            body: `Your OTP Code: ${otp}`,
            from: '+12015551234',
            to: to,
        });
        return res;
    }
    catch (error) {
        console.log("Send message error", error);
        throw new AppError_1.AppError(401, "Send message error");
    }
});
exports.sendMessage = sendMessage;
