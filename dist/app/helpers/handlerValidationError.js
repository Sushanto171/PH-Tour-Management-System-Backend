"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerValidationError = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
/* eslint-disable @typescript-eslint/no-explicit-any */
const handlerValidationError = (err) => {
    const error = Object.values(err.errors);
    const errorSource = error.map((field) => {
        return { path: field.path, message: field.message };
    });
    return {
        message: "Validation Error",
        statusCode: http_status_codes_1.default.BAD_REQUEST,
        errorSource,
    };
};
exports.handlerValidationError = handlerValidationError;
