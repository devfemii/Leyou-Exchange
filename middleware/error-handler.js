const { StatusCodes } = require("http-status-codes");
const ErrorHandlerMiddleWare = (error, req, res, next) => {
  let customError = {
    message: error.message?.startsWith("Error:")
      ? error.message.slice(7)
      : error.message || "Internal Server Error",
    code: error.statusCode || 500,
  };
  if (error.name === "CastError") {
    customError.message = `Invalid ${error.path}: '${error.value}' is not a valid ${error.kind}.`;
    customError.code = StatusCodes.BAD_REQUEST;
  }
  // if (error.code === "LIMIT_UNEXPECTED_FILE") {
  //   customError.message = "Please upload less than the required number of files";
  // }
  return res.status(customError.code).json({ status: "ERROR", ...customError });
};

module.exports = ErrorHandlerMiddleWare;
