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

export const config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
};
