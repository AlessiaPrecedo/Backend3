import { config } from "../config/env.config.js";
import { AppError } from "../errors/app.error.js";
import { ERROR_CODES } from "../errors/error.codes.js";
import { ErrorsDictionary } from "../errors/error.dictionary.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(ERROR_CODES.ROUTE_NOT_FOUND));
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
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

  if (config.nodeEnv === "development") {
    if (err.details) {
      response.details = err.details;
    } else if (!(err instanceof AppError) && err.message) {
      response.details = err.message;
    }
  }

  res.status(definition.statusCode).json(response);
};
