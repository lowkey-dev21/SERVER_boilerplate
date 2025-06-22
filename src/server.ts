/**
 * Main Server Entry Point
 *
 * This file initializes and configures the Express application, sets up middleware,
 * connects to the database, and starts the HTTP server.
 *
 * Features:
 * - Loads environment variables from .env
 * - Connects to MongoDB using connectDB()
 * - Sets up middleware: JSON parsing, URL encoding, cookies, CORS, Helmet for security
 * - Logs HTTP requests and responses using custom logger
 * - Registers authentication routes and a health check endpoint
 * - Starts the server on the specified port
 *
 * @module server
 */

import express, { Application, Request, Response, NextFunction } from "express";
import "dotenv/config";
import { connectDB } from "./configs/db";
import cors from "cors";
import { logger } from "./utils/logger";
import helmet from "helmet";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";
import uploaderRoute from "./routes/uploader.route";

const app: Application = express();
const PORT: number = +(process.env.PORT ?? 4040);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: 500 }));

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(helmet());

/**
 * HTTP request logging middleware.
 * Logs incoming requests and outgoing responses using the custom logger.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.http(`[-> ${req.method} ${req.url} - IP: ${req.ip}`);

  // Log response when finished
  res.on("finish", () => {
    logger.http(`${req.method} ${req.url} - Status: ${res.statusCode} <-]`);
  });

  next();
});

/**
 * Health check endpoint.
 * @route GET /api/your-api/v1/health
 * @returns {Object} 200 - { message: " everywhere good" }
 */
app.get("/api/your-api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ message: " everywhere good" });
});

/**
 * Authentication routes.
 * @route /api/your-api/v1/auth
 */
app.use("/api/your-api/v1/auth", authRoutes);
app.use("/api/gta/v1/upload", uploaderRoute);

//adds loger to the app for use in other modules
logger;

// Connect to MongoDB and start the server
connectDB();

// Start the server
app.listen(PORT, () => logger.info("Server is running on " + PORT));
