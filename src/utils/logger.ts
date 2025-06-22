import "dotenv/config";
import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import winston from "winston";
import { existsSync, mkdirSync } from "fs";

const { combine, timestamp } = format;

// Define custom levels type with index signature
interface CustomLevels {
  [key: string]: number;
  error: number;
  warn: number;
  info: number;
  http: number;
  verbose: number;
  debug: number;
  silly: number;
}

// Define the levels configuration
const levels: CustomLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define colors with proper type
const colors: { [key: string]: string } = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "green",
  verbose: "white",
  debug: "orange",
  silly: "cyan",
};

winston.addColors(colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message} `;
    const metaString = Object.keys(metadata).length
      ? JSON.stringify(metadata)
      : "";
    return msg + metaString;
  })
);

// Create the logs directory if it doesn't exist
const logDir = path.join(process.cwd(), "logs");
const httpDir = path.join(logDir, "http");
const errorDir = path.join(logDir, "error");
const combinedDir = path.join(logDir, "combined");
const exceptionsDir = path.join(logDir, "exceptions");
const rejectionsDir = path.join(logDir, "rejections");

[logDir, httpDir, errorDir, combinedDir, exceptionsDir, rejectionsDir].forEach(
  dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
);

const logger = createLogger({
  levels: levels,
  format: logFormat,
  transports: [
    // Console Transport
    new transports.Console({
      format: combine(format.colorize({ all: true }), logFormat),
      level: "debug",
    }),

    // Combined logs with daily rotation
    new DailyRotateFile({
      filename: path.join(combinedDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      format: logFormat,
      level: "debug",
    }),

    // HTTP logs with daily rotation
    new DailyRotateFile({
      filename: path.join(httpDir, "http-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      level: "http",
      format: combine(
        logFormat,
        winston.format(info => {
          return info.level === "http" ? info : false;
        })()
      ),
    }),

    // Error logs with daily rotation
    new DailyRotateFile({
      filename: path.join(errorDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
      format: logFormat,
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(exceptionsDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      format: logFormat,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(rejectionsDir, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      format: logFormat,
    }),
  ],
  exitOnError: false,
});

export { logger };
