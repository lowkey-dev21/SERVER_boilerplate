/**
 * User Model - Mongoose schema and TypeScript interface for application users.
 *
 * This model defines the structure for user documents in MongoDB, including:
 * - Basic user info (name, phone, country, email, password)
 * - Role-based access (Student, Admin, etc.)
 * - Profile details (bio, avatar, skill level)
 * - Verification and password reset fields
 * - Agreement to terms
 * - Virtual field for full name
 *
 * @module models/user.model
 */

import { Document, Schema, model } from "mongoose";
import { UserRole } from "../types/user.types";


/**
 * ITwoFactorInfo - Interface for 2FA details
 */
export interface ITwoFactorInfo {
    secret?: {
        ascii: string;
        hex: string;
        base32: string;
        otpauth_url: string;
    };
    enabled: boolean;
}


/**
 * UserI - TypeScript interface for User documents.
 */
export interface UserI extends Document {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  email: string;
  password: string;
  role?: UserRole;
  full_name?: string; // Virtual field
  agree_terms: boolean;
  security: {
      two_factor: ITwoFactorInfo;
  };
}




/**
 * userSchema - Mongoose schema for User.
 */
const userSchema = new Schema(
  {
    first_name: { type: String, required: true }, // User's first name
    last_name: { type: String, required: true }, // User's last name
    phone: { type: String, required: true, unique: true }, // Unique phone number
    country: { type: String, required: true }, // Country of residence
    email: { type: String, required: true, unique: true }, // Unique email address
    password: { type: String, required: true }, // Hashed password
    agree_terms: {
      type: Boolean,
      required: true, // User must agree to terms
    },
    role: {
      type: String,
      enum: Object.values(UserRole), // User role (enum)
      default: UserRole.USER,
    },
    profile: {
      bio: { type: String, default: "" }, // User bio
      avatar: { type: String, default: "" }, // Avatar image URL
      level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"], // Skill level
        default: "beginner",
      },
    },

    is_premium : {
        type: Boolean,
        default: false,
    },

    security: {
        two_factor: {
            secret: {
                ascii: { type: String },
                hex: { type: String },
                base32: { type: String },
                otpauth_url: { type: String },
            },
            enabled: {
                type: Boolean, default: false
            }
        }
    },

    // Additional fields for user verification and password reset
    is_verified: { type: Boolean, default: false }, // Email verified status
    verify_email_token: String, // Email verification token
    verify_email_token_expires: Date, // Token expiry
    reset_password_token: String, // Password reset token
    reset_password_token_expires: Date, // Token expiry
  },

  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true }, // Include virtuals in object output
  }
);

/**
 * Virtual field: full_name
 * Combines first_name and last_name for convenience.
 */
userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

/**
 * User - Mongoose model for User schema.
 */
const User = model("User", userSchema);
export default User;
