/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { handlerCastError } from "../helpers/handlerCastError";
import { handlerDuplicateError } from "../helpers/handlerDuplicateError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { handlerZodError } from "../helpers/handlerZodError";
import { TErrorSource } from "../interfaces/ErrorTypes";
import { AppError } from "./../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("GlobalError", err);
  }
  let statusCode = 500;
  let message = `Something went wrong !!`;
  let errorSource: TErrorSource[] = [];
  // castError
  if (err.name === "CastError") {
    const simplifiedError = handlerCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handlerZodError(err);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorSource = simplifiedError.errorSource as TErrorSource[];
  }
  // validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handlerValidationError(err);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorSource = simplifiedError.errorSource as TErrorSource[];
  }
  // duplicate error
  else if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    error: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
