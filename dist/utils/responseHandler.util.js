"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const logger_util_1 = __importDefault(require("./logger.util"));
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
const sendSuccess = (res, statusCode = 200, message = 'Success', data, meta) => {
    var _a;
    const response = {
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
    logger_util_1.default.apiSuccess(res.req.method, res.req.originalUrl, statusCode, res.getHeader('X-Response-Time') || 0, 
    // @ts-ignore - user property added by auth middleware
    (_a = res.req.user) === null || _a === void 0 ? void 0 : _a.id);
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
/**
 * Send error response
 *
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} errorData - Additional error data
 * @returns {Response} Express response
 */
const sendError = (res, statusCode = 500, message = 'Server Error', errorData) => {
    var _a;
    const response = {
        success: false,
        statusCode,
        message,
    };
    if (errorData) {
        response.meta = { errorData };
    }
    // Log error API response
    logger_util_1.default.apiError(res.req.method, res.req.originalUrl, statusCode, res.getHeader('X-Response-Time') || 0, message, 
    // @ts-ignore - user property added by auth middleware
    (_a = res.req.user) === null || _a === void 0 ? void 0 : _a.id);
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
