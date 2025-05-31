import { AppError, ErrorSeverity } from '../interfaces/error.interface';

export const createError = (
  message: string,
  statusCode: number,
  errorData?: Record<string, any>,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  isOperational = true
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  error.isOperational = isOperational;
  error.severity = severity;
  error.errorData = errorData;
  
  Error.captureStackTrace(error, createError);
  return error;
};

export { AppError };
