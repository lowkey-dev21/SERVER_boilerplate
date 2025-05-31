import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';
import logger from "./logger.util";

/**
 * Send success response
 *
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {T} data - Response data
 * @param {object} meta - Additional metadata
 * @returns {Response} Express response
 */
export const sendSuccess = <T>(
    res: Response,
    statusCode: number = 200,
    message: string = 'Success',
    data?: T,
    meta?: Record<string, any>
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        statusCode,
        message,
    };

    if (data !== undefined) {
        response.data = data;
    }

    if (meta) {
        response.meta = meta;
    }

    // Log successful API response
    logger.apiSuccess(
        res.req.method,
        res.req.originalUrl,
        statusCode,
        res.getHeader('X-Response-Time') as number || 0,
        // @ts-ignore - user property added by auth middleware
        res.req.user?.id
    );

    return res.status(statusCode).json(response);
};

/**
 * Send error response
 *
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} errorData - Additional error data
 * @returns {Response} Express response
 */
export const sendError = (
    res: Response,
    statusCode: number = 500,
    message: string = 'Server Error',
    errorData?: Record<string, any>
): Response => {
    const response: ApiResponse<null> = {
        success: false,
        statusCode,
        message,
    };

    if (errorData) {
        response.meta = { errorData };
    }

    // Log error API response
    logger.apiError(
        res.req.method,
        res.req.originalUrl,
        statusCode,
        res.getHeader('X-Response-Time') as number || 0,
        message,
        // @ts-ignore - user property added by auth middleware
        res.req.user?.id
    );

    return res.status(statusCode).json(response);
};