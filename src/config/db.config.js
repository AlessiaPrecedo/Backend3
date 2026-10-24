import mongoose from "mongoose";
import { config } from "./env.config.js";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    logger.info("MongoDB connected successfully", {
      mongoUrl: config.mongoUrl,
      nodeEnv: config.nodeEnv,
    });
  } catch (error) {
    logger.fatal("MongoDB connection failed", {
      error: error.message,
      stack: error.stack,
      mongoUrl: config.mongoUrl,
    });
    throw error;
  }
};
