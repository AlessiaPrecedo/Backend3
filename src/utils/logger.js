import fs from "node:fs";
import path from "node:path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../config/env.config.js";

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  http: 3,
  info: 4,
  debug: 5,
};
const colors = {
  fatal: "bold red",
  error: "red",
  warning: "yellow",
  http: "magenta",
  info: "green",
  debug: "blue",
};
const validLevels = Object.keys(levels);

if (!validLevels.includes(config.logLevel)) {
  throw new Error(
    `Invalid LOG_LEVEL "${config.logLevel}". Expected one of: ${validLevels.join(", ")}`,
  );
}

winston.addColors(colors);

const logDirectory = path.resolve(process.cwd(), "logs");
fs.mkdirSync(logDirectory, { recursive: true });

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const logger = winston.createLogger({
  levels,
  level: config.logLevel,
  transports: [
    new DailyRotateFile({
      dirname: logDirectory,
      filename: "application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat,
    }),
    new DailyRotateFile({
      dirname: logDirectory,
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "error",
      format: winston.format.combine(
        winston.format((info) =>
          info.level === "error" || info.level === "fatal" ? info : false,
        )(),
        fileFormat,
      ),
    }),
  ],
});

if (config.nodeEnv === "development") {
  logger.add(
    new winston.transports.Console({
      level: config.logLevel,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
          const details = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : "";
          return `${timestamp} ${level}: ${stack || message}${details}`;
        }),
      ),
    }),
  );
} else {
  logger.add(
    new winston.transports.Console({
      level: config.logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  );
}

export default logger;