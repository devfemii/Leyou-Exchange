const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-error");

class NotFoundError extends CustomAPIError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
