/**
 * Enum for error severity levels
 */
export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

/**
 * Interface for application errors
 */
export interface AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    severity: ErrorSeverity;
    code? : string;
    errorData? : Record<string, any>;
}

/**
 * Interface for error response objects
 */
export interface ErrorResponse {
    statusCode: number;
    status: string;
    message: string;
    stack: string;
    errorData?: Record<string, any>;
}