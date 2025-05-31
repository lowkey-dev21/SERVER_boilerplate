"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerConfig = exports.securityConfig = exports.jwtConfig = exports.dbConfig = exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
/**
 * Application environment configuration
 */
exports.appConfig = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
    appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`
};
/**
 * Database configuration
 */
exports.dbConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/secure-express-boilerplate',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: !exports.appConfig.isProduction
    }
};
/**
 * JWT configuration
 */
exports.jwtConfig = {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access_token_secret',
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_token_secret',
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d'
};
/**
 * Security configuration
 */
exports.securityConfig = {
    argonSaltRounds: parseInt(process.env.ARGON_SALT_ROUNDS || '12', 10),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000, // 15 minutes by default
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window by default
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*']
};
/**
 * Get the appropriate log level based on the environment
 */
const getLogLevel = () => {
    if (exports.appConfig.isProduction)
        return 'info';
    if (exports.appConfig.isTest)
        return 'warn';
    return 'debug';
};
/**
 * Logger configuration
 */
exports.loggerConfig = {
    logLevel: process.env.LOG_LEVEL || getLogLevel(),
    logToConsole: process.env.LOG_TO_CONSOLE !== 'false',
    logToFile: process.env.LOG_TO_FILE !== 'false',
    logDir: process.env.LOG_DIR || path_1.default.join(process.cwd(), 'logs'),
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d'
};
