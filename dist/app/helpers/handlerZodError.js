"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerZodError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const handlerZodError = (err) => {
    const issues = Object.values(err.issues);
    const errorSource = issues.map((issue) => {
        let state = "";
        issue.path.forEach((element) => {
            state += element + " inside ";
        });
        state = state.endsWith(" inside ") ? state.slice(0, state.length - 8) : "";
        return {
            path: state,
            message: issue.message,
        };
    });
    return {
        statusCode: http_status_codes_1.default.BAD_REQUEST,
        message: "Validation Error",
        errorSource,
    };
};
exports.handlerZodError = handlerZodError;
