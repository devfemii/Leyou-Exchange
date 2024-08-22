const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-error");

class BadRequestError extends CustomAPIError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
