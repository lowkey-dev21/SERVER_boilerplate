import express, {Application, Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from 'path'
import hpp from 'hpp'
import {appConfig,securityConfig} from "./configs/config";
import {setupLogging} from "./middlewares/common/logger.middleware";
import logger from "./utils/logger.util";
import rateLimit from "express-rate-limit";
import { errorHandler, notFoundHandler } from './middlewares/common/error.middleware';


/**
 * Initialize Express application
 * @return {Application} Express application
 */
const createApp = () : Application => {
    const app: Application = express();

    //Log startup
    logger.system('AppStartup', 'Initializing Express application',{
        environment: appConfig.nodeEnv,
        startupTime: new Date().toISOString()
    })

    // Trust proxy if behind reverse proxy
    if (appConfig.isProduction) {
        app.set('trust proxy', 1);
    }

    // Set security HTTP headers
    app.use(helmet());
    logger.system('SecuritySetup', 'Applied Helmet security headers');

    //Setup CORS
    app.use(cors({
        origin: securityConfig.corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))
    logger.system('SecuritySetup','Configured CORS',{
      origins: securityConfig.corsOrigins
    })

    //Rate limiting
    const limiter = rateLimit({
        windowMs: securityConfig.rateLimitWindow,
        max: securityConfig.rateLimitMax,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests from this IP, please try again later',
        skip: () => appConfig.isDevelopment // Skip rate limiting in development
    })

    app.use('/api/', limiter);
    logger.system('securitySetup', 'Applied rate limiting', {
        window: `${securityConfig.rateLimitWindow / 60000} minutes`,
        limit: securityConfig.rateLimitMax
    })

    // Body parser
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Cookie parser
    app.use(cookieParser());

    // Prevent parameter pollution
    app.use(hpp());
    logger.system('SecuritySetup', 'Applied HPP protection');

    // Serve static files
    app.use('/public', express.static(path.join(__dirname, '../public')));
    logger.system('AppSetup', 'Configured static file serving');


    // Health check endpoint
    app.get('/api/health', (req: Request, res: Response) => {
        const uptime = process.uptime();
        const uptimeFormatted = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;

        res.status(200).json({
            status: 'success',
            message: 'Server is healthy',
            environment: appConfig.nodeEnv,
            timestamp: new Date().toISOString(),
            uptime: uptimeFormatted,
            memoryUsage: process.memoryUsage(),
        });
    });

    // Error handling
    app.use(notFoundHandler);
    app.use(errorHandler);
    logger.system('AppSetup', 'Configured error handling middleware');

    return app;
}

export default createApp;