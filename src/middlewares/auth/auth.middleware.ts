import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../configs/config';
import { createError } from '../../utils/error.util';
import logger from '../../utils/logger.util';
import { UserRole, JwtPayload, UserPayload } from '../../interfaces/auth.interface';

/**
 * Extended Request interface to include user information
 */
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

/**
 * Middleware to verify JWT access token
 */
export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : null;

        if (!token) {
            // Log the error and return a 401 Unauthorized response
            res.status(401).json({message: 'Access denied. No token provided.'});
            logger.security('NoTokenProvided', 'Access denied. No token provided');
            return next(createError('Access denied. No token provided.', 401));
        }


        // Cast the decoded token to our custom JwtPayload interface
        const decoded = jwt.verify(
            token, 
            jwtConfig.accessToken.secret, 
            {
                issuer: jwtConfig.accessToken.issuer,
                algorithms: [jwtConfig.accessToken.algorithm as jwt.Algorithm]
            }
        ) as JwtPayload;

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.security('TokenExpired', 'Access token expired', {
                error: error.message
            });
            next(createError('Token expired', 401));
        } else {
            logger.error('Authentication error', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            next(createError('Invalid token', 401));
        }
    }
};

/**
 * Middleware to restrict access based on user roles
 */
export const restrictTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw createError('User not authenticated', 401);
        }

        if (!roles.includes(req.user.role)) {
            logger.security('UnauthorizedAccess', 'Permission denied', {
                userId: req.user.id,
                requiredRoles: roles,
                userRole: req.user.role
            });
            throw createError('Permission denied', 403);
        }

        next();
    };
};

/**
 * Middleware to verify refresh token
 */
export const verifyRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw createError('Refresh token not provided', 401);
        }

        const decoded = jwt.verify(
            refreshToken,
            jwtConfig.refreshToken.secret,
            {
                issuer: jwtConfig.refreshToken.issuer,
                algorithms: [jwtConfig.refreshToken.algorithm as jwt.Algorithm]
            }
        ) as JwtPayload;

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        logger.security('RefreshTokenError', 'Invalid refresh token', {
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        next(createError('Invalid refresh token', 401));
    }
};