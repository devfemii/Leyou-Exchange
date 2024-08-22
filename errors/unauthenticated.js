const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-error");

class UnAuthenticatedError extends CustomAPIError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnAuthenticatedError;
