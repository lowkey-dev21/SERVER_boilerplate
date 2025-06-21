import { body } from "express-validator";

export const validateSignInInput = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  body("first_name").trim().notEmpty().withMessage("First name is required"),
  body("last_name").trim().notEmpty().withMessage("Last name is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
];

export const validateLoginInput = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateRequestPasswordReset = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

export const validateResetPassword = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("new_password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
];
