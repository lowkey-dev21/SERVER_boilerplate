import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/tokenGenerator";
import {
  errorApiResponse,
  ApiResponseCode,
  errMessage,
} from "../../utils/apiResponse";

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return errorApiResponse(
        res,
        "No authentication token provided",
        errMessage.UNAUTHORIZED,
        ApiResponseCode.UNAUTHORIZED
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = verifyToken(secret, token);

    // Attach the decoded user information to the request object
    req.user = decoded;

    next();
  } catch (error) {
    return errorApiResponse(
      res,
      "Invalid or expired token",
      errMessage.UNAUTHORIZED,
      ApiResponseCode.UNAUTHORIZED
    );
  }
};
