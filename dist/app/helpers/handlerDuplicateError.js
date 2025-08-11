"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicateError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const handlerDuplicateError = (err) => {
    const matchedArray = err.errmsg.match(/"([^"]*)"/);
    const message = `${matchedArray[1]} is already exist.`;
    return {
        statusCode: http_status_codes_1.default.CONFLICT,
        message,
    };
};
exports.handlerDuplicateError = handlerDuplicateError;
