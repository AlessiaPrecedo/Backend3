import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
}

if (!process.env.MONGO_URI) {
  throw new Error("The MONGO_URI variable is missing from the .env file.");
}

export const config = {
  port: process.env.PORT || 8080,
  mongoUrl: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
};
