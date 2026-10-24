import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("The PORT variable is missing from the .env file.");
}

if (!process.env.MONGODB_URI) {
  throw new Error("The MONGODB_URI variable is missing from the .env file.");
}

if (!process.env.NODE_ENV) {
  throw new Error("The NODE_ENV variable is missing from the .env file.");
}

const normalizedNodeEnv = process.env.NODE_ENV.trim().toLowerCase();
const defaultLogLevel = normalizedNodeEnv === "production" ? "info" : "debug";

export const config = {
  port: Number(process.env.PORT || 8080),
  mongoUrl: process.env.MONGODB_URI,
  nodeEnv: normalizedNodeEnv,
  logLevel: process.env.LOG_LEVEL || defaultLogLevel,
  jwtSecret: process.env.JWT_SECRET,
};
