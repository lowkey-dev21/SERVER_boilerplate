/**
 * Enum for log levels with numeric values
 */
export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    HTTP = 3,
    DEBUG = 4,
}

/**
 * Log level type for string values
 */
export type LogLevelString = 'error' | 'warn' | 'info' | 'http' | 'debug';



/**
 * Interface for structured log entries
 */
export interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    metadata?: Record<string, any>;
    stack?: string;
}

/**
 * Interface for logger configuration
 */
export interface LoggerConfig {
    logLevel: LogLevelString;
    logToConsole: boolean;
    logToFile: boolean;
    logDir: string;
    maxSize: string;
    maxFiles: string;
}