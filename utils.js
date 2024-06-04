const crypto = require("crypto");

const sendErrorMessage = (message, code) => {
  const error = {
    status: "ERROR",
    code: code,
    message: message,
  };

  return error;
};

// create a function to send a success message
const sendSuccessMessage = (message, code) => {
  const success = {
    status: "SUCCESS",
    code: code,
    message: message,
  };

  return success;
};

const newError = (message, code) => {
  const error = new Error(message);
  error.status = code;
  throw error;
};

function generateOTP(length = 6) {
  const digits = "0123456789";

  if (length < 1) {
    throw new Error("OTP length must be at least 1");
  }

  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
}

function generateReferralCode(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let referralCode = "";

  // Generate a random byte array and map it to characters
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charactersLength;
    referralCode += characters[randomIndex];
  }

  return referralCode;
}

function capitalizeName(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function changeCasingToLowercase(name) {
  return name.toLowerCase();
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function convertToTradedCurrency() {}

module.exports = {
  sendErrorMessage,
  sendSuccessMessage,
  newError,
  generateOTP,
  generateReferralCode,
  capitalizeName,
  changeCasingToLowercase,
  validateEmail,
};
