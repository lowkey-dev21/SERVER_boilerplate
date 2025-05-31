"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const hpp_1 = __importDefault(require("hpp"));
const config_1 = require("./configs/config");
const logger_util_1 = __importDefault(require("./utils/logger.util"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Initialize Express application
 * @return {Application} Express application
 */
const createApp = () => {
    const app = (0, express_1.default)();
    //Log startup
    logger_util_1.default.system('AppStartup', 'Initializing Express application', {
        environment: config_1.appConfig.nodeEnv,
        startupTime: new Date().toISOString()
    });
    // Trust proxy if behind reverse proxy
    if (config_1.appConfig.isProduction) {
        app.set('trust proxy', 1);
    }
    // Set security HTTP headers
    app.use((0, helmet_1.default)());
    logger_util_1.default.system('SecuritySetup', 'Applied Helmet security headers');
    //Setup CORS
    app.use((0, cors_1.default)({
        origin: config_1.securityConfig.corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    logger_util_1.default.system('SecuritySetup', 'Configured CORS', {
        origins: config_1.securityConfig.corsOrigins
    });
    //Rate limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: config_1.securityConfig.rateLimitWindow,
        max: config_1.securityConfig.rateLimitMax,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests from this IP, please try again later',
        skip: () => config_1.appConfig.isDevelopment // Skip rate limiting in development
    });
    app.use('/api/', limiter);
    logger_util_1.default.system('securitySetup', 'Applied rate limiting', {
        window: `${config_1.securityConfig.rateLimitWindow / 60000} minutes`,
        limit: config_1.securityConfig.rateLimitMax
    });
    // Body parser
    app.use(express_1.default.json({ limit: '10kb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
    // Cookie parser
    app.use((0, cookie_parser_1.default)());
    // Prevent parameter pollution
    app.use((0, hpp_1.default)());
    logger_util_1.default.system('SecuritySetup', 'Applied HPP protection');
    // Serve static files
    app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
    logger_util_1.default.system('AppSetup', 'Configured static file serving');
    // Health check endpoint
    app.get('/api/health', (req, res) => {
        const uptime = process.uptime();
        const uptimeFormatted = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;
        res.status(200).json({
            status: 'success',
            message: 'Server is healthy',
            environment: config_1.appConfig.nodeEnv,
            timestamp: new Date().toISOString(),
            uptime: uptimeFormatted,
            memoryUsage: process.memoryUsage(),
        });
    });
    // // Error handling
    // app.use(notFoundHandler);
    // app.use(errorHandler);
    // logger.system('AppSetup', 'Configured error handling middleware');
    return app;
};
exports.default = createApp;
