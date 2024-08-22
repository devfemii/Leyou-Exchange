const BadRequestError = require("./bad-request");
const UnAuthenticatedError = require("./unauthenticated");
const NotFoundError = require("./not-found");
const UnprocessableEntityError = require("./unprocessable-entity");

module.exports = { BadRequestError, UnAuthenticatedError, NotFoundError, UnprocessableEntityError };
