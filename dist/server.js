"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./configs/config");
const logger_util_1 = __importDefault(require("./utils/logger.util"));
/**
 * Initialize server
 */
const startSever = async () => {
    try {
        const app = (0, app_1.default)();
        //start server
        const server = app.listen(config_1.appConfig.port, () => {
            logger_util_1.default.info(`Server running in ${config_1.appConfig.nodeEnv} mode on port ${config_1.appConfig.port}`);
            logger_util_1.default.info(`API is available at ${config_1.appConfig.appUrl}/api`);
        });
        //Handle unhandled rejections
        process.on('unhandledRejection', err => {
            logger_util_1.default.error('UNHANDLED REJECTION 💥 Shutting down...', err);
            //Graceful shutdown
            server.close(() => {
                process.exit(1);
            });
        });
        // Handle SIGTERM signal
        process.on('SIGTERM', () => {
            logger_util_1.default.info('SIGTERM received. Shutting down gracefully');
            server.close(() => {
                logger_util_1.default.info('Process terminated');
            });
        });
        //Check why the server exits
        // process.on('exit', (code) => {
        //     logger.info('Process Exiting... with code: ', code);
        // })
    }
    catch (e) {
        logger_util_1.default.error('Failed to start server', e);
        process.exit(1);
    }
};
//Start the server
startSever().then(() => {
    logger_util_1.default.info('Server started');
});
