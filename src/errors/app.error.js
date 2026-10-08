import { ERROR_CODES } from "./error.codes.js";
import { ErrorsDictionary } from "./error.dictionary.js";

export class AppError extends Error {
  constructor(
    code = ERROR_CODES.INTERNAL_SERVER_ERROR,
    customMessage,
    details,
  ) {
    const errorDefinition =
      ErrorsDictionary[code] ||
      ErrorsDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR];
    super(customMessage || errorDefinition.message);
    this.name = this.constructor.name;
    this.code = ErrorsDictionary[code]
      ? code
      : ERROR_CODES.INTERNAL_SERVER_ERROR;
    this.statusCode = errorDefinition.statusCode;
    this.details = details;
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(ERROR_CODES.USER_NOT_FOUND);
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super(ERROR_CODES.USER_ALREADY_EXISTS);
  }
}

export class ProductNotFoundError extends AppError {
  constructor() {
    super(ERROR_CODES.PRODUCT_NOT_FOUND);
  }
}

export class ProductAlreadyExistsError extends AppError {
  constructor() {
    super(ERROR_CODES.PRODUCT_ALREADY_EXISTS);
  }
}

export class OrderNotFoundError extends AppError {
  constructor() {
    super(ERROR_CODES.ORDER_NOT_FOUND);
  }
}

export class DeliveryNotFoundError extends AppError {
  constructor() {
    super(ERROR_CODES.DELIVERY_NOT_FOUND);
  }
}

export class InvalidOrderStatusError extends AppError {
  constructor() {
    super(ERROR_CODES.INVALID_ORDER_STATUS);
  }
}

export class InvalidDeliveryStatusError extends AppError {
  constructor() {
    super(ERROR_CODES.INVALID_DELIVERY_STATUS);
  }
}

export class DriverNotAvailableError extends AppError {
  constructor() {
    super(ERROR_CODES.DRIVER_NOT_AVAILABLE);
  }
}

export class InvalidMockAmountError extends AppError {
  constructor(maximum) {
    super(
      ERROR_CODES.INVALID_MOCK_AMOUNT,
      `quantity must be an integer between 1 and ${maximum}`,
    );
  }
}

export class InvalidMockTypeError extends AppError {
  constructor(type) {
    super(ERROR_CODES.INVALID_MOCK_TYPE, `unsupported mock type: ${type}`);
  }
}

export class DatabaseUnavailableError extends AppError {
  constructor() {
    super(ERROR_CODES.DATABASE_UNAVAILABLE);
  }
}

export class MockPersistenceError extends AppError {
  constructor(details) {
    super(ERROR_CODES.MOCK_PERSISTENCE_FAILED, undefined, details);
  }
}
