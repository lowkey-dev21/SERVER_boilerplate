import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper function to catch async errors in route handlers
 *
 * @param {Function} fn - Async function to execute
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction): Promise<any> => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default catchAsync;