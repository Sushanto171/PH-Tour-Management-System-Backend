"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingZodSchema = exports.createBookingZodSchema = void 0;
const v3_1 = __importDefault(require("zod/v3"));
const booking_interface_1 = require("./booking.interface");
exports.createBookingZodSchema = v3_1.default.object({
    tour: v3_1.default.string({
        required_error: "Tour id must be required.",
        invalid_type_error: "Tour must be string format",
    }),
    guestCount: v3_1.default.number().int().positive(),
});
exports.updateBookingZodSchema = v3_1.default.object({
    status: v3_1.default.enum(Object.values(booking_interface_1.BOOKING_STATUS)),
});
