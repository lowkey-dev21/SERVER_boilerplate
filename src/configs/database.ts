import mongoose from 'mongoose';
import { appConfig } from './config';
import logger from '../utils/logger.util';

export const dbConfig = {
  url: appConfig.mongoUri,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};

export const connectDatabase = async (dbConfig: { url: string; options: { useNewUrlParser: boolean; useUnifiedTopology: boolean; }; }): Promise<void> => {
  try {
    if (!dbConfig.url) {
      throw new Error('MongoDB connection URL is not defined');
    }

    await mongoose.connect(dbConfig.url);

    logger.info('MongoDB Connected Successfully');

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};
