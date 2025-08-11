"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerCastError = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlerCastError = (err) => {
    const match = err.message.match(/Cast to (\w+) failed for value "?([^"\s]+)"? \(type \w+\) at path "([^"]+)"(?: for model "([^"]+)")?/);
    const [, expectedType, value, field, model] = match;
    const readable = `The value "${value}" is not a valid "${expectedType}" for the field "${field}" ${model ? `in the "${model}" model ` : ""}.`;
    return {
        statusCode: http_status_codes_1.default.BAD_REQUEST,
        message: readable,
    };
};
exports.handlerCastError = handlerCastError;
