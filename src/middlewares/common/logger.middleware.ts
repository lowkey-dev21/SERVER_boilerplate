import { Request, Response, NextFunction } from 'express';
import morgan, { StreamOptions } from 'morgan';
import logger from "../../utils/logger.util";
import { appConfig } from '../../configs/config';

// Morgan stream option that uses winston logger
const stream: StreamOptions = {
    write: (message) => logger.http(message.trim()),
};

/**
 * Skip logging for paths that don't need to be logged
 */
const skipLog = (req: Request, res: Response) => {
    // Skip logging for health checks and other non-important routes
    const paths = ['/api/health', '/favicon.ico'];
    if (paths.includes(req.originalUrl)) {
        return true;
    }
    
    // Skip logging for successful static file requests
    if (req.originalUrl.startsWith('/public') && res.statusCode < 400) {
        return true;
    }
    
    return false;
};

/**
 * Format for development environment
 */
const devFormat = ':method :url :status :res[content-length] - :response-time ms';

/**
 * Format for production environment
 */
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

/**
 * HTTP request logger middleware using morgan
 */
export const requestLogger = morgan(
    appConfig.isDevelopment ? devFormat : prodFormat,
    {
        stream,
        skip: skipLog,
    }
);

/**
 * Body logger middleware for development
 */
export const bodyLogger = (req: Request, res: Response, next: NextFunction): void => {
    if (appConfig.isDevelopment && req.method !== 'GET') {
        const sanitizedBody = { ...req.body };

        // Sanitize sensitive data
        if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
        if (sanitizedBody.passwordConfirm) sanitizedBody.passwordConfirm = '[REDACTED]';
        if (sanitizedBody.creditCard) sanitizedBody.creditCard = '[REDACTED]';
        if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';

        logger.debug('Request body:', sanitizedBody);
    }
    next();
};

/**
 * Log uncaught errors
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error('Uncaught exception', {
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });
    next(err);
};

/**
 * Combine all logging middleware
 */
export const setupLogging = (app: any): void => {
    app.use(requestLogger);
    app.use(bodyLogger);
    app.use(errorLogger);
};
