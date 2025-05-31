"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLogging = exports.errorLogger = exports.bodyLogger = exports.requestLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
/**
 * Skip logging for certain routes
 */
const skipLog = (req) => {
    //skip logging for health checks and static files
    return req.originalUrl === '/api/health' || req.originalUrl === '/favicon.ico';
};
/**
 * Format for all environments
 */
const logFormat = ':method :url :status :response-time ms';
/**
 * HTTP request logger middleware using morgan
 */
exports.requestLogger = (0, morgan_1.default)(logFormat, {
    stream: {
        write: (message) => logger_util_1.default.http(message.trim()),
    },
    skip: skipLog,
});
/**
 * Body logger middleware for development
 */
const bodyLogger = (req, res, next) => {
    if (process.env.NODE_ENV === 'development' && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const sanitizedBody = { ...req.body };
        // Sanitize sensitive data
        if (sanitizedBody.password)
            sanitizedBody.password = '[REDACTED]';
        if (sanitizedBody.passwordConfirm)
            sanitizedBody.passwordConfirm = '[REDACTED]';
        if (sanitizedBody.token)
            sanitizedBody.token = '[REDACTED]';
        logger_util_1.default.debug('Request body:', sanitizedBody);
    }
    next();
};
exports.bodyLogger = bodyLogger;
/**
 * Log uncaught errors
 */
const errorLogger = (err, req, res, next) => {
    logger_util_1.default.error('Uncaught exception', {
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });
    next(err);
};
exports.errorLogger = errorLogger;
/**
 * Combine all logging middleware
 */
const setupLogging = (app) => {
    app.use(exports.requestLogger);
    app.use(exports.bodyLogger);
    app.use(exports.errorLogger);
};
exports.setupLogging = setupLogging;
