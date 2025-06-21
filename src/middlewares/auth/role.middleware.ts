import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../types/user.types";
import {
  errorApiResponse,
  ApiResponseCode,
  errMessage,
} from "../../utils/apiResponse";

export const checkRole = (roles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user from request (assuming it's set by auth middleware)
      const user = req.user;

      if (!user) {
        return errorApiResponse(
          res,
          "User not authenticated",
          errMessage.UNAUTHORIZED,
          ApiResponseCode.UNAUTHORIZED,
          "error"
        );
      }

      // Convert single role to array for consistent handling
      const requiredRoles = Array.isArray(roles) ? roles : [roles];

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.includes(user.role);

      if (!hasRequiredRole) {
        return errorApiResponse(
          res,
          "Insufficient permissions",
          errMessage.FORBIDDEN,
          ApiResponseCode.FORBIDDEN,
          "error"
        );
      }

      next();
    } catch (error) {
      return errorApiResponse(
        res,
        "Role verification failed",
        error,
        ApiResponseCode.INTERNAL_ERROR,
        "error"
      );
    }
  };
};

// Helper middleware for specific roles
export const isAdmin = checkRole(UserRole.ADMIN);
export const isInstructor = checkRole(UserRole.INSTRUCTOR);
export const isStudent = checkRole(UserRole.STUDENT);
