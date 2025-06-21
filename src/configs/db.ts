import mongoose from "mongoose";
import "dotenv/config";
import { logger } from "../utils/logger";

export async function connectDB() {
  try {
    if (!process.env.dbURI) {
      logger.error(
        "Database URI (dbURI) is not defined in environment variables."
      );
    }
    await mongoose.connect(process.env.dbURI || "");
    logger.info("Connected to MongoDB ✅");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
