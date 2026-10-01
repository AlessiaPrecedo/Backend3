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

if (!process.env.LOG_LEVEL) {
  throw new Error("The LOG_LEVEL variable is missing from the .env file.");
}

export const config = {
  port: process.env.PORT || 8080,
  mongoUrl: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL || "debug",
  jwtSecret: process.env.JWT_SECRET,
};
