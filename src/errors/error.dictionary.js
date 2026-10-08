import { ERROR_CODES } from "./error.codes.js";

export const ErrorsDictionary = {
  [ERROR_CODES.VALIDATION_ERROR]: {
    statusCode: 400,
    message: "the data sent is not valid",
  },
  [ERROR_CODES.USER_NOT_FOUND]: {
    statusCode: 404,
    message: "user not found",
  },
  [ERROR_CODES.USER_ALREADY_EXISTS]: {
    statusCode: 409,
    message: "user already exists",
  },
  [ERROR_CODES.PRODUCT_NOT_FOUND]: {
    statusCode: 404,
    message: "product not found",
  },
  [ERROR_CODES.PRODUCT_ALREADY_EXISTS]: {
    statusCode: 409,
    message: "product already exists",
  },
  [ERROR_CODES.ORDER_NOT_FOUND]: {
    statusCode: 404,
    message: "order not found",
  },
  [ERROR_CODES.DELIVERY_NOT_FOUND]: {
    statusCode: 404,
    message: "delivery not found",
  },
  [ERROR_CODES.INVALID_ORDER_STATUS]: {
    statusCode: 400,
    message: "invalid order status",
  },
  [ERROR_CODES.INVALID_DELIVERY_STATUS]: {
    statusCode: 400,
    message: "invalid delivery status",
  },
  [ERROR_CODES.DRIVER_NOT_AVAILABLE]: {
    statusCode: 400,
    message: "driver not available",
  },
  [ERROR_CODES.INVALID_MOCK_AMOUNT]: {
    statusCode: 400,
    message: "invalid mock amount",
  },
  [ERROR_CODES.INVALID_MOCK_TYPE]: {
    statusCode: 404,
    message: "unsupported mock type",
  },
  [ERROR_CODES.DATABASE_UNAVAILABLE]: {
    statusCode: 503,
    message: "database is unavailable",
  },
  [ERROR_CODES.DATABASE_CONFLICT]: {
    statusCode: 409,
    message: "resource conflicts with an existing record",
  },
  [ERROR_CODES.MOCK_PERSISTENCE_FAILED]: {
    statusCode: 500,
    message: "mock data could not be saved",
  },
  [ERROR_CODES.ROUTE_NOT_FOUND]: {
    statusCode: 404,
    message: "route not found",
  },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    statusCode: 500,
    message: "internal server error",
  },
};
