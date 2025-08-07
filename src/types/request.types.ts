import { Request } from "express";
import {UserRole} from "./user.types";

/**
 * Extends the base Express Request to include the `user`
 * object that is attached by our authentication middleware.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role? : UserRole
  };
}