import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = "Validation failed";
  return new AppError(message, 400, errors);
};

const handleZodError = (err) => {
  const errors = err.errors.map((e) => {
    return e.message;
  });
  return new AppError("Invalid input", 400, errors);
};

const globalErrorHandler = (err, req, res, next) => {
  console.error("Global Error Handler: " + err);
  const statusCode = err.statusCode || 500;
  // Handle known error types
  if (err.name === "ValidationError") {
    err = handleValidationError(err);
  }
  if (err.name === "ZodError") {
    err = handleZodError(err);
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    errors: err.errors || null,
  });
};

export default globalErrorHandler;
