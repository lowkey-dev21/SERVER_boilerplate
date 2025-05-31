"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogColors = exports.LogLevel = void 0;
/**
 * Enum for log levels with numeric values
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["HTTP"] = 3] = "HTTP";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Mapping of log levels to colors for console output
 */
exports.LogColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};
