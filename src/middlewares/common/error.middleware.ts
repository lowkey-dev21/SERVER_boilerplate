import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError, createError } from "../../utils/error.util";
import { ErrorResponse, ErrorSeverity } from "../../interfaces/error.interface";
import logger from "../../utils/logger.util";
import { appConfig } from "../../configs/config";

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, any>;
}

const handleDuplicateKeyError = (err: MongoError): AppError => {
  const fieldName = Object.keys(err.keyValue || {})[0];
  const message = `Duplicate value for field '${fieldName}'. Please use another value.`;
  return createError(message, 400, { field: fieldName }, ErrorSeverity.MEDIUM);
};

const handleValidationError = (err: mongoose.Error.ValidationError): AppError => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return createError(message, 400, { validationErrors: errors }, ErrorSeverity.MEDIUM);
};

const handleJWTError = (): AppError => {
  return createError("Invalid token. Please log in again.", 401, undefined, ErrorSeverity.HIGH);
};

const handleJWTExpiredError = (): AppError => {
  return createError("Your token has expired. Please log in again.", 401, undefined, ErrorSeverity.MEDIUM);
};

const handleCastError = (err: mongoose.Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return createError(message, 400, { path: err.path, value: err.value }, ErrorSeverity.LOW);
};

const sendDevError = (err: AppError, res: Response): void => {
  const errorResponse: ErrorResponse = {
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack || '',
    errorData: err.errorData,
  };

  logger.error(`[${err.statusCode}] ${err.message}`, {
    error: err,
    stack: err.stack,
    severity: err.severity
  });

  res.status(err.statusCode).json(errorResponse);
};

const sendProdError = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    logger.error(`[${err.statusCode}] ${err.message}`, {
      severity: err.severity
    });

    const errorResponse: ErrorResponse = {
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      stack: '',
      errorData: err.errorData,
    };

    res.status(err.statusCode).json(errorResponse);
  }

  logger.error("Unexpected error", { 
    error: err,
    stack: err.stack,
    severity: ErrorSeverity.CRITICAL 
  });

  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Something went wrong",
    stack: '',
  });
};

export const errorHandler = (
  err: Error | AppError | MongoError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = isAppError(err) 
    ? err 
    : createError(err.message || "Server Error", 500, undefined, ErrorSeverity.CRITICAL);

  if (err.name === "CastError") {
    error = handleCastError(err as mongoose.Error.CastError);
  }
  if (err.name === "ValidationError") {
    error = handleValidationError(err as mongoose.Error.ValidationError);
  }
  if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  }
  if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }
  if ((err as MongoError).code === 11000) {
    error = handleDuplicateKeyError(err as MongoError);
  }

  if (appConfig.isDevelopment) {
    sendDevError(error, res);
  } else {
    sendProdError(error, res);
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(createError(`Cannot find ${req.originalUrl} on this server`, 404, undefined, ErrorSeverity.LOW));
};

// Type guard to check if an error is AppError
const isAppError = (error: Error | AppError | MongoError): error is AppError => {
  return 'statusCode' in error && 'status' in error && 'isOperational' in error;
};
