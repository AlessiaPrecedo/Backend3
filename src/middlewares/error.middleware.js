import { config } from "../config/env.config.js";
import { AppError } from "../errors/app.error.js";
import { ERROR_CODES } from "../errors/error.codes.js";
import { ErrorsDictionary } from "../errors/error.dictionary.js";
import logger from "../utils/logger.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(ERROR_CODES.ROUTE_NOT_FOUND));
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    logger.error("Error occurred after response headers were sent", {
      method: req.method,
      path: req.path,
      error: err.message,
      stack: err.stack,
    });
    return next(err);
  }

  let errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
  if (err instanceof AppError) {
    errorCode = err.code;
  } else if (err?.name === "ValidationError" || err?.name === "CastError") {
    errorCode = ERROR_CODES.VALIDATION_ERROR;
  } else if (err?.code === 11000) {
    errorCode = ERROR_CODES.DATABASE_CONFLICT;
  }

  const definition =
    ErrorsDictionary[errorCode] ||
    ErrorsDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR];
  const response = {
    status: "error",
    error: errorCode,
    message: err instanceof AppError ? err.message : definition.message,
  };

  const logLevel =
    definition.statusCode >= 500
      ? "error"
      : definition.statusCode >= 400
        ? "warning"
        : "info";
  logger[logLevel]("Request failed", {
    method: req.method,
    path: req.path,
    statusCode: definition.statusCode,
    error: errorCode,
    message: err.message,
    ...(config.nodeEnv === "development" ? { stack: err.stack } : {}),
  });

  if (config.nodeEnv === "development") {
    if (err.details) {
      response.details = err.details;
    } else if (!(err instanceof AppError) && err.message) {
      response.details = err.message;
    }
  }

  res.status(definition.statusCode).json(response);
};
