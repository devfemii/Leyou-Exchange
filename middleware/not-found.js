const { StatusCodes } = require("http-status-codes");
const NotFoundMiddleWare = (req, res, next) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ status: "ERROR", message: "Route does not exist", code: StatusCodes.NOT_FOUND });
};

module.exports = NotFoundMiddleWare;
