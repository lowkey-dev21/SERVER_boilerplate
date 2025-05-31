import dotenv from 'dotenv';
import path from 'path';
import { AppConfig, DbConfig, JwtConfig, SecurityConfig } from '../interfaces/config.interface';
import { LoggerConfig, LogLevelString } from '../interfaces/logger.interface';

// Load environment variables
dotenv.config();

/**
 * Application environment configuration
 */
export const appConfig: AppConfig = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database',
    appUrl: process.env.APP_URL || 'http://localhost:5000',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test'
};

/**
 * Database configuration
 */
export const dbConfig: DbConfig = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/secure-express-boilerplate',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: !appConfig.isProduction
    }
};

/**
 * JWT configuration with enhanced security options
 */
export const jwtConfig: JwtConfig = {
    // Access Token
    accessToken: {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your_super_secret_access_key_here',
        expiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
        algorithm: 'HS256',
        issuer: 'api-server',
    },
    
    // Refresh Token
    refreshToken: {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'your_super_secret_refresh_key_here',
        expiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
        algorithm: 'HS256',
        issuer: 'api-server',
    },
    
    // Password Reset Token
    resetToken: {
        secret: process.env.JWT_RESET_TOKEN_SECRET || 'your_super_secret_reset_key_here',
        expiry: process.env.JWT_RESET_TOKEN_EXPIRY || '10m',
        algorithm: 'HS256',
        issuer: 'api-server',
    },
    
    // Email Verification Token
    verificationToken: {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET || 'your_super_secret_verification_key_here',
        expiry: process.env.JWT_VERIFICATION_TOKEN_EXPIRY || '24h',
        algorithm: 'HS256',
        issuer: 'api-server',
    }
};

/**
 * Security configuration
 */
export const securityConfig: SecurityConfig = {
    argonSaltRounds: parseInt(process.env.ARGON_SALT_ROUNDS || '12', 10),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000, // 15 minutes by default
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window by default
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*']
};

/**
 * Get the appropriate log level based on the environment
 */
const getLogLevel = (): LogLevelString => {
    if (appConfig.isProduction) return 'info';
    if (appConfig.isTest) return 'warn';
    return 'debug';
};

/**
 * Logger configuration
 */
export const loggerConfig: LoggerConfig = {
    logLevel: (process.env.LOG_LEVEL as LogLevelString) || getLogLevel(),
    logToConsole: process.env.LOG_TO_CONSOLE !== 'false',
    logToFile: process.env.LOG_TO_FILE !== 'false',
    logDir: process.env.LOG_DIR || path.join(process.cwd(), 'logs'),
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d'
};