import { logger } from "./logger";
import { NextFunction, Response } from "express";

export enum ApiResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  FAIL = "fail",
}

export enum errMessage {
  UNAUTHORIZED = "Unauthorized access",
  FORBIDDEN = "Forbidden access",
  BAD_REQUEST = "Bad request",
  INTERNAL_ERROR = "Internal server error",
  VALIDATION_ERROR = "Validation error",
}

export enum ApiResponseCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export const errorApiResponse = (
  res: Response,
  msg: string,
  errMsg: errMessage | any,
  statusCode: ApiResponseCode | ApiResponseCode.BAD_REQUEST,
  logLevel: "info" | "error" = "error",
  next?: NextFunction
) => {
  logger[logLevel](`${msg} - Status Code: ${statusCode}`);
  const errorResponse = {
    status: ApiResponseStatus.ERROR,
    statusCode,
    message: msg,
    error: errMsg,
  };

  if (next) {
    next(errorResponse);
  } else {
    res.status(statusCode).json(errorResponse);
  }
};

export const successApiResponse = <T>(
  res: Response,
  msg: string = "Request successful",
  data: T,
  statusCode: ApiResponseStatus | ApiResponseCode = ApiResponseCode.OK,
  logLevel: "info" | "error" | "warn" | "debug" = "info",
  next?: NextFunction
) => {
  const successResponse = {
    status: ApiResponseStatus.SUCCESS,
    statusCode,
    message: msg,
    data,
  };
  logger[logLevel](`${msg} - Status Code: ${statusCode}`);
  if (next) {
    next(successResponse);
  } else {
    res.status(+statusCode).json(successResponse);
  }
};
