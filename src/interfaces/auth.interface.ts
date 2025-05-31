import {Request} from "express";
import {Document} from "mongoose";
import jwt from "jsonwebtoken";

/**
 * Enum for user roles
 */
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MANAGER = 'manager',
}

/**
 * Interface for user document
 */
export interface IUser extends Document {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
    isActive?: boolean;
    refreshToken?: string;
    refreshTokenExpires?: number;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    createdAt: Date;
    updatedAt: Date;


    //Method
    isPasswordCorrect(password: string): Promise<void>;
    createPasswordResetToken(): string;
    changedPasswordAfter(JWTTimestamp: number): boolean
}

/**
 * Interface extending Express Request for authenticated routes
 */
export interface AuthRequest extends Request{
    user? : UserPayload
}


/**
 * Interface for JWT tokens
 */
export interface JwtPayload extends jwt.JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}

/**
 * Interface for user payload
 */
export interface UserPayload {
    id: string;
    email: string;
    role: UserRole;
}

/**
 * Interface for token response
 */
export interface TokenResponse{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}