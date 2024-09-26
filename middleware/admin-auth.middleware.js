const jwt = require("jsonwebtoken");
require("dotenv").config();
const { newError, sendErrorMessage } = require("../utils");

const adminAuth = async (req, res, next) => {
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

    const payload = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    req.decoded = { id: payload.id };
    next();
  } catch (error) {
    throw new Error("Authentication Failed");
  }
};

module.exports = adminAuth;
