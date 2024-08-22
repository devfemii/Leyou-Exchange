const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-error");

class UnprocessableEntityError extends CustomAPIError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}

module.exports = UnprocessableEntityError;
