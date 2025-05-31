import { cleanEnv, str, port, url } from 'envalid';
import logger from './logger.util';

export const validateEnv = () => {
  try {
    const env = cleanEnv(process.env, {
      NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
      PORT: port({ default: 5000 }),
      MONGODB_URI: url(),
      APP_URL: str(),
    });

    logger.info('Environment variables validated successfully');
    logger.debug('App configuration:', {
      nodeEnv: env.NODE_ENV,
      port: env.PORT,
      mongoUri: env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'), // Hide credentials in logs
      appUrl: env.APP_URL
    });

    return env;
  } catch (error) {
    logger.error('Environment validation failed:', error);
    throw error;
  }
};