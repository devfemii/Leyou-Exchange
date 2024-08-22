const jwt = require("jsonwebtoken");
require("dotenv").config();
const { newError, sendErrorMessage } = require("../utils");

const auth = async (req, res, next) => {
  try {
    let token = null;

    //if token is being sent through headers
    const { authorization } = req.headers;
    if (authorization && authorization.includes("Bearer")) {
      token = authorization.split(" ")[1];
    }
    //if token is neither in the cookies nor the headers
    if (!token) {
      return newError("supply token", 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //----------> save the user id into the decoded parameter in the request
    req.decoded = { id: payload.id };
    next();
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = auth;
