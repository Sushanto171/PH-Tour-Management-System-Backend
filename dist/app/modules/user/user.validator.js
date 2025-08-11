"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const v3_1 = __importDefault(require("zod/v3"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = v3_1.default.object({
    name: v3_1.default
        .string({
        invalid_type_error: "Name must be string format.",
        required_error: "Name must be required.",
    })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: v3_1.default
        .string({
        required_error: "Email must be required.",
        invalid_type_error: "Email must be string format.",
    })
        .min(5, { message: "Email must be at least 5 characters long" })
        .email(),
    password: v3_1.default
        .string({ invalid_type_error: "Password must be string format." })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phone: v3_1.default
        .string({ invalid_type_error: "Phone must be string format." })
        .regex(/^(\+?88)?01[3-9]\d{8}$/, {
        message: "Phone must be valid for Bangladesh, Format: '+8801########' or 'o1#########' ",
    })
        .optional(),
    address: v3_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
});
exports.updateUserZodSchema = v3_1.default.object({
    name: v3_1.default
        .string({
        invalid_type_error: "Name must be string format.",
        required_error: "Name must be required.",
    })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    phone: v3_1.default
        .string({ invalid_type_error: "Phone must be string format." })
        .regex(/^(\+?88)?01[3-9]\d{8}$/, {
        message: "Phone must be valid for Bangladesh, Format: '+8801########' or 'o1#########' ",
    })
        .optional(),
    address: v3_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    isActive: v3_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    role: v3_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isDeleted: v3_1.default
        .boolean({ message: "Is Deleted must be true or false" })
        .optional(),
    isVerified: v3_1.default
        .boolean({ message: "IsVerified must be true or false" })
        .optional(),
});
