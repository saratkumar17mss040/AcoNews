export default function errorHandler(err, req, res, next) {
  let { statusCode, message } = err;

  statusCode = statusCode || 500;
  message = message || "Internal Server Error";

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json(response);
}
