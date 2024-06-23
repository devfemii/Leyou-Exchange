const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../models/user.model");
const OTP = require("../models/OTP.model");

const { existingUser, updateUserAccount } = require("./user.service");
const { sendResetLink, sendEmailVerificationOTP } = require("./email.service");
const {
  newError,
  generateOTP,
  generateReferralCode,
  capitalizeName,
  changeCasingToLowercase,
  validateEmail,
} = require("../utils");

dotenv.config();

const createUserAccount = async (
  tradeWith,
  email,
  password,
  name,
  userName,
  phoneNumber
) => {
  try {
    const isUsernameExisting = await existingUser({ userName });
    const isEmailExisting = await existingUser({ email });

    if (isEmailExisting) {
      return newError("Email already exist", 400);
    }

    if (isUsernameExisting) {
      return newError("Username already exist", 400);
    }

    const generatedReferralCode = generateReferralCode();

    const validatedMail = validateEmail(email);

    if (!validatedMail) {
      return newError("Invalid email, try again", 400);
    }

    const user = await User.create({
      tradeWith: tradeWith,
      email: email,
      password: password,
      name: capitalizeName(name),
      userName: userName,
      phoneNumber: phoneNumber,
      referralCode: generatedReferralCode,
    });

    return user;
  } catch (error) {
    return newError(error.message, error.status ?? 500);
  }
};

const loginUser = async (userName, password) => {
  try {
    const user = await existingUser({ userName });

    if (!user) {
      return newError("User doesn't exist", 404);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return newError("Invalid credentials", 400);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TOKEN_EXPIRES,
    });

    return { user, token };
  } catch (error) {
    return newError(error.message, error.status);
  }
};

const sendCodeToEmail = async (email) => {
  try {
    const generatedOTP = generateOTP();
    await sendEmailVerificationOTP(email, generatedOTP);

    const validOTP = await OTP.findOne({ email });

    if (validOTP) {
      await OTP.findOneAndUpdate({ OTP: validOTP.OTP }, { OTP: generatedOTP });
      return;
    }

    await OTP.create({
      OTP: generatedOTP,
    });
  } catch (error) {
    return newError(error.message, 500);
  }
};

const verifyCodeFromEmail = async (oneTimePassword) => {
  try {
    const validOTP = await OTP.findOne({ OTP: oneTimePassword });

    if (!validOTP) {
      return newError("Invalid OTP", 404);
    }

    const OTPdocument = await OTP.findOneAndDelete({ OTP: oneTimePassword });

    if (OTPdocument) {
      const check = await OTP.findOne({ OTP: oneTimePassword });
      if (check) {
        newError("OTP was not successfully verified");
      }
    }
  } catch (error) {
    return newError(error.message, 500);
  }
};

const forgetUserPassword = async (email) => {
  try {
    const user = await existingUser({ email: email });

    if (!user) {
      return newError("User does not exist", 404);
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: 20 * 60,
      }
    );

    const link = `${process.env.SERVER_URL}/api/auth/verify-mail-password-reset/${token}`;
    await sendResetLink(email, user.name, link);
  } catch (error) {
    return newError(error.message, error.status);
  }
};

const updateUserPassword = async (id, currentPassword, password) => {
  try {
    const user = await existingUser({ _id: id });
    if (!user.canResetPassword) {
      return newError("You need to verify email before resetting password!");
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return newError("Invalid credentials", 400);
    }

    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    await updateUserAccount(
      {
        _id: id,
      },
      { password: hashedPassword, canResetPassword: false }
    );
  } catch (error) {
    console.log(error);
    return newError(error.message, 500);
  }
};

const verifiedEmailForPasswordReset = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await updateUserAccount({ _id: payload.id }, { canResetPassword: true });

    // REDIRECT TO THE CLIENT URL AND ENCODE THE ID
    // res
    // .status(StatusCodes.PERMANENT_REDIRECT)
    // .redirect(
    //   `${process.env.CLIENT_URL}/reset-password/?email=${encodeURIComponent(
    //     user.email
    //   )}`
    // );
  } catch (error) {
    return newError(error.message, error.status);
  }
};

module.exports = {
  createUserAccount,
  loginUser,
  forgetUserPassword,
  sendCodeToEmail,
  verifyCodeFromEmail,
  verifiedEmailForPasswordReset,
  updateUserPassword,
};
