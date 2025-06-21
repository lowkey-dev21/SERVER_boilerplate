import express from "express";
import {
  validateSignInInput,
  validateLoginInput,
  validateRequestPasswordReset,
  validateResetPassword,
} from "../middlewares/validation/user.validate";
import {
  createUser,
  loginUser,
  confirmEmail,
  getCurrentUser,
  regenerateEmailCode,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth/user.controller";
import { authMiddleware } from "../middlewares/auth/auth.middleware";
const router = express.Router();

// User registration route
router.post("/sign-up", validateSignInInput, createUser);
// User login route
router.post("/sign-in", validateLoginInput, loginUser);
// Email confirmation route
router.post("/confirm-email", authMiddleware, confirmEmail);
// Regenerate email confirmation code route
router.get("/regenerate-email-code", authMiddleware, regenerateEmailCode);
// Request password reset route
router.post(
  "/request-password-reset",
  validateRequestPasswordReset,
  requestPasswordReset
);
// Reset password route
router.post("/reset-password", validateResetPassword, resetPassword);

// Get current user route
router.get("/current", getCurrentUser);

// Export the router
export default router;
