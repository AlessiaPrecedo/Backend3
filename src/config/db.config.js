import mongoose from "mongoose";
import { config } from "./env.config.js";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB", {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};
