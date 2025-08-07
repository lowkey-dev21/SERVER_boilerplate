import { Response, NextFunction } from "express";
import { UserRole } from "../../types/user.types";
import User from "../../models/user.model";
import {
  errorApiResponse,
  ApiResponseCode,
  errMessage,
} from "../../utils/apiResponse";
import { AuthenticatedRequest } from "../../types/request.types";

/**
 * Middleware factory to check if a user has one of the required roles.
 * @param requiredRoles - An array of roles that are allowed to access the route.
 */
export const checkRole = (requiredRoles: UserRole[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.userId;

    if (!userId) {
      return errorApiResponse(
        res,
        "Authentication error: User ID not found in token.",
        errMessage.UNAUTHORIZED,
        ApiResponseCode.UNAUTHORIZED
      );
    }

    try {
      const user = await User.findById(userId).select("role");
      if (!user) {
        return errorApiResponse(
          res,
          "User not found.",
          errMessage.NOT_FOUND,
          ApiResponseCode.NOT_FOUND
        );
      }

      if (!requiredRoles.includes(user.role as UserRole)) {
        return errorApiResponse(
          res,
          "Forbidden: You do not have permission to access this resource.",
          errMessage.FORBIDDEN,
          ApiResponseCode.FORBIDDEN
        );
      }

      next();
    } catch (error) {
      return errorApiResponse(
        res,
        "Internal Server Error",
        error instanceof Error ? error.message : "Unknown error",
        ApiResponseCode.INTERNAL_ERROR
      );
    }
  };
};


export const isUser = checkRole([UserRole.USER])
export const isAdmin_or_SubAdmin = checkRole([UserRole.ADMIN])

/**
 * Middleware to check if a user is a "Pro" user by checking the `is_premium` flag.
 */
export const isProUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return errorApiResponse(
      res,
      "Authentication error: User ID not found in token.",
      errMessage.UNAUTHORIZED,
      ApiResponseCode.UNAUTHORIZED
    );
  }

  try {
    const user = await User.findById(userId).select("info.is_premium");
    if (!user) {
      return errorApiResponse(res, "User not found.", errMessage.NOT_FOUND, ApiResponseCode.NOT_FOUND);
    }

    if (!user.is_premium) {
      return errorApiResponse(
        res,
        "Forbidden: This feature is for Pro users only.",
        errMessage.FORBIDDEN,
        ApiResponseCode.FORBIDDEN
      );
    }

    next();
  } catch (error) {
    return errorApiResponse(
      res,
      "Internal Server Error",
      error instanceof Error ? error.message : "Unknown error",
      ApiResponseCode.INTERNAL_ERROR
    );
  }
};