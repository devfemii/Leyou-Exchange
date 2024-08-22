const { StatusCodes } = require("http-status-codes");
const ErrorHandlerMiddleWare = (error, req, res, next) => {
  let customError = {
    message: error.message || "Internal Server Error",
    code: error.statusCode || 500,
  };
  if (error.name === "CastError") {
    customError.message = `Invalid ${error.path}: '${error.value}' is not a valid ${error.kind}.`;
    customError.code = StatusCodes.BAD_REQUEST;
  }

  return res.status(500).json({ status: "ERROR", ...customError });
};

module.exports = ErrorHandlerMiddleWare;
