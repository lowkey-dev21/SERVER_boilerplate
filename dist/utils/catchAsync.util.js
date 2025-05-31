"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapper function to catch async errors in route handlers
 *
 * @param {Function} fn - Async function to execute
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = catchAsync;
