"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_interface_1 = require("../interfaces/logger.interface");
// Create a basic configuration object
const loggerConfig = {
    logLevel: process.env.LOG_LEVEL || 'info',
    logToConsole: process.env.LOG_TO_CONSOLE !== 'false',
    logToFile: process.env.LOG_TO_FILE !== 'false',
    logDir: process.env.LOG_DIR || path_1.default.join(process.cwd(), 'logs'),
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d'
};
// Ensure log directory exists
const logDir = loggerConfig.logDir;
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
/**
 * Custom log levels with associated severity
 */
const logLevels = {
    error: logger_interface_1.LogLevel.ERROR,
    warn: logger_interface_1.LogLevel.WARN,
    info: logger_interface_1.LogLevel.INFO,
    http: logger_interface_1.LogLevel.HTTP,
    debug: logger_interface_1.LogLevel.DEBUG,
};
/**
 * Creates a custom log format for consistent logging
 */
const logFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
/**
 * Format for console output
 */
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length > 0 && meta.stack !== undefined
        ? `\n${meta.stack}`
        : Object.keys(meta).length > 0
            ? `\n${JSON.stringify(meta, null, 2)}`
            : '';
    return `${timestamp} [${level}]: ${message}${metaString}`;
}));
// Create a transport array
const transports = [];
// Add console transport if enabled
if (loggerConfig.logToConsole) {
    transports.push(new winston_1.default.transports.Console({
        format: consoleFormat,
        level: loggerConfig.logLevel
    }));
}
// Add file transports if enabled and if winston-daily-rotate-file is available
if (loggerConfig.logToFile) {
    try {
        // Try to use file transport without rotation as fallback
        transports.push(new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
            format: logFormat
        }), new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'combined.log'),
            level: loggerConfig.logLevel,
            format: logFormat
        }));
    }
    catch (err) {
        console.error('Error setting up file transport:', err);
    }
}
/**
 * Create a comprehensive logger with multiple transports
 */
const logger = winston_1.default.createLogger({
    levels: logLevels,
    defaultMeta: { service: 'api-server' },
    transports,
    exceptionHandlers: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'exceptions.log'),
            format: logFormat
        })
    ],
    rejectionHandlers: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'rejections.log'),
            format: logFormat
        })
    ],
    exitOnError: false
});
// Add colors to Winston
winston_1.default.addColors(logger_interface_1.LogColors);
/**
 * Extended logger with additional helper methods
 */
const extendedLogger = {
    error: logger.error.bind(logger),
    warn: logger.warn.bind(logger),
    info: logger.info.bind(logger),
    http: logger.http.bind(logger),
    debug: logger.debug.bind(logger),
    /**
     * Log successful API requests
     */
    apiSuccess: (method, url, status, responseTime, userId) => {
        logger.http('API Request Success', {
            method,
            url,
            status,
            responseTime,
            userId
        });
    },
    /**
     * Log failed API requests
     */
    apiError: (method, url, status, responseTime, error, userId) => {
        logger.error('API Request Failed', {
            method,
            url,
            status,
            responseTime,
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            userId
        });
    },
    /**
     * Log security events
     */
    security: (event, message, metadata) => {
        logger.warn('Security Event', {
            event,
            message,
            ...metadata
        });
    },
    /**
     * Log system events
     */
    system: (event, message, metadata) => {
        logger.info('System Event', {
            event,
            message,
            ...metadata
        });
    }
};
exports.default = extendedLogger;
