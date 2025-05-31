import createApp from './app';
import { appConfig } from "./configs/config";
import { connectDatabase, dbConfig } from './configs/database';
import logger from "./utils/logger.util";
import { validateEnv } from './utils/validateEnv.util';

/**
 * Initialize server
 */
const startServer = async (): Promise<void> => {
    try {
        // Validate environment variables
        validateEnv();
        
        logger.info('Starting server initialization...');

        // Connect to database first
        logger.info('Connecting to MongoDB...');
        await connectDatabase(dbConfig);

        const app = createApp();

        const server = app.listen(appConfig.port, () => {
            logger.info('------------------------------------');
            logger.info(`🚀 Server started successfully`);
            logger.info(`📝 Environment: ${appConfig.nodeEnv}`);
            logger.info(`🌐 URL: ${appConfig.appUrl}`);
            logger.info(`🚪 Port: ${appConfig.port}`);
            logger.info(`📚 API: ${appConfig.appUrl}/api`);
            logger.info('------------------------------------');
        });

        // Handle unhandled rejections
        process.on('unhandledRejection', (err: any) => {
            logger.error('UNHANDLED REJECTION 💥 Shutting down...', err);
            server.close(() => {
                process.exit(1);
            });
        });

        // Handle SIGTERM signal
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received. Shutting down gracefully');
            server.close(() => {
                logger.info('Process terminated');
                process.exit(0);
            });
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer().catch((error) => {
    logger.error('Startup error:', error);
    process.exit(1);
});