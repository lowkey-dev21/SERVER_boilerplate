import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { LogLevel} from '../interfaces/logger.interface';

// Create a basic configuration object
const loggerConfig = {
    logLevel: process.env.LOG_LEVEL || 'info',
    logToConsole: process.env.LOG_TO_CONSOLE !== 'false',
    logToFile: process.env.LOG_TO_FILE !== 'false',
    logDir: process.env.LOG_DIR || path.join(process.cwd(), 'logs'),
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d'
};

// Ensure log directory exists
const logDir = loggerConfig.logDir;
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Custom log levels with associated severity
 */
const logLevels = {
    error: LogLevel.ERROR,
    warn: LogLevel.WARN,
    info: LogLevel.INFO,
    http: LogLevel.HTTP,
    debug: LogLevel.DEBUG,
};

// Create colors for winston with enhanced ANSI colors
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue", // Bright cyan for debug messages
};

// Add colors to Winston
winston.addColors(colors);

/**
 * Format for console output with colors and simplified structure
 */
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ 
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.colorize({ 
        level: true 
    }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length > 0 
            ? ` ${JSON.stringify(meta)}`
            : '';
        return `${timestamp} [${level}]: ${message}${metaString}`;
    })
);

/**
 * Format for file output with simplified structure
 */
const fileFormat = winston.format.combine(
    winston.format.timestamp({ 
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ 
        stack: true 
    }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length > 0 
            ? ` ${JSON.stringify(meta)}`
            : '';
        return `${timestamp} [${level}]: ${message}${metaString}`;
    })
);

/**
 * Get the current day's filename with format: dayname-YYYY-MM-DD.log
 */
const getDailyFilename = (prefix: string = ''): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const date = new Date();
    const dayName = days[date.getDay()];
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return `${prefix}${dayName}-${formattedDate}.log`;
};

// Create a transport array
const transports: winston.transport[] = [];

// Add console transport with colors
if (loggerConfig.logToConsole) {
    transports.push(
        new winston.transports.Console({
            format: consoleFormat,
            level: loggerConfig.logLevel
        })
    );
}

// Add file transports without colors
if (loggerConfig.logToFile) {
    transports.push(
        new winston.transports.File({
            filename: path.join(logDir, getDailyFilename('error-')),
            level: 'error',
            format: fileFormat
        }),
        new winston.transports.File({
            filename: path.join(logDir, getDailyFilename()),
            level: loggerConfig.logLevel,
            format: fileFormat
        })
    );
}

/**
 * Create a comprehensive logger with multiple transports
 */
const logger = winston.createLogger({
    levels: logLevels,
    defaultMeta: { service: 'api-server' },
    transports,
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, getDailyFilename('exception-')),
            format: fileFormat
        })
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, getDailyFilename('rejection-')),
            format: fileFormat
        })
    ],
    exitOnError: false
});

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
    apiSuccess: (
        method: string,
        url: string,
        status: number,
        responseTime: number,
        userId?: string
    ): void => {
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
    apiError: (
        method: string,
        url: string,
        status: number,
        responseTime: number,
        error: any,
        userId?: string
    ): void => {
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
    security: (
        event: string,
        message: string,
        metadata?: Record<string, any>
    ): void => {
        logger.warn('Security Event', {
            event,
            message,
            ...metadata
        });
    },

    /**
     * Log system events
     */
    system: (
        event: string,
        message: string,
        metadata?: Record<string, any>
    ): void => {
        logger.info('System Event', {
            event,
            message,
            ...metadata
        });
    }
};

export default extendedLogger;