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
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const multer_config_1 = require("../config/multer.config");
const handlerCastError_1 = require("../helpers/handlerCastError");
const handlerDuplicateError_1 = require("../helpers/handlerDuplicateError");
const handlerValidationError_1 = require("../helpers/handlerValidationError");
const handlerZodError_1 = require("../helpers/handlerZodError");
const AppError_1 = require("./../errorHelpers/AppError");
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log("GlobalError", err);
    }
    if (req.file) {
        yield (0, multer_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = req.files.map((file) => file.path);
        yield Promise.all(imageUrls.map((url) => (0, multer_config_1.deleteImageFromCloudinary)(url)));
    }
    let statusCode = 500;
    let message = `Something went wrong !!`;
    let errorSource = [];
    // castError
    if (err.name === "CastError") {
        const simplifiedError = (0, handlerCastError_1.handlerCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handlerZodError_1.handlerZodError)(err);
        message = simplifiedError.message;
        statusCode = simplifiedError.statusCode;
        errorSource = simplifiedError.errorSource;
    }
    // validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handlerValidationError_1.handlerValidationError)(err);
        message = simplifiedError.message;
        statusCode = simplifiedError.statusCode;
        errorSource = simplifiedError.errorSource;
    }
    // duplicate error
    else if (err.code === 11000) {
        const simplifiedError = (0, handlerDuplicateError_1.handlerDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        error: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
});
exports.globalErrorHandler = globalErrorHandler;
