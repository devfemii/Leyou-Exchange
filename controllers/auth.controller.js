const {
  createUserAccount,
  forgetUserPassword,
  loginUser,
  sendCodeToEmail,
  verifyCodeFromEmail,
  verifiedEmailForPasswordReset,
  updateUserPassword,
} = require("../services/auth.service");

const { updateUserAccount } = require("../services/user.service");

const { sendErrorMessage, sendSuccessMessage } = require("../utils");

const register = async (req, res) => {
  const {
    country,
    email,
    name,
    userName,
    phoneNumber,
    isEmailVerified,
    password,
  } = req.body;

  try {
    const user = await createUserAccount(
      country,
      email,
      password,
      name,
      userName,
      phoneNumber,
      isEmailVerified
    );

    return res.status(201).json(
      sendSuccessMessage(
        {
          userId: user._id,
          message:
            "Thanks for joining, you can now enjoy seamless trading of gift cards to naira to our platform.",
        },
        201
      )
    );
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const response = await loginUser(name, password);

    return res.status(200).json(
      sendSuccessMessage(
        {
          userDetails: {
            name: response.user.name,
            email: response.user.email,
            country: response.user.country,
            username: response.user.username,
            phoneNumber: response.user.phoneNumber,
            referralCode: response.user.referralCode,
          },
          token: response.token,
        },
        201
      )
    );
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    await forgetUserPassword(email);
    return res
      .status(201)
      .json(sendSuccessMessage("Reset link sent successfully", 200));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

const sendCode = async (req, res) => {
  const { email } = req.body;

  try {
    await sendCodeToEmail(email);
    return res
      .status(201)
      .json(
        sendSuccessMessage(
          "We have sent a six-digit verification code to your E-mail. if you didn't get it tap resend code.",
          200
        )
      );
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

const verifyCode = async (req, res) => {
  const { OTP } = req.body;

  try {
    await verifyCodeFromEmail(OTP);
    return res.status(201).json(
      sendSuccessMessage(
        {
          isEmailVerified: true,
        },
        200
      )
    );
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

const verifiedEmailPasswordReset = async (req, res) => {
  try {
    const token = req.params.signature;
    await verifiedEmailForPasswordReset(token);

    res
      .status(200)
      .json(
        sendSuccessMessage(
          "your email is successfully verified, return to the app and proceed to reset your password",
          200
        )
      );
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

const updatePassword = async (req, res) => {
  const { id, password } = req.body;
  try {
    await updateUserPassword(id, password);

    res
      .status(200)
      .json(
        sendSuccessMessage(
          "you have successfully updated your password, proceed to login",
          200
        )
      );
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

const createTransactionPin = async (req, res) => {
  const { userId, transactionPin } = req.body;
  try {
    await updateUserAccount(
      { _id: userId },
      { transactionPin: transactionPin }
    );

    return res
      .status(201)
      .json(sendSuccessMessage("Pin created successfully", 201));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

module.exports = {
  register,
  createTransactionPin,
  verifiedEmailPasswordReset,
  forgetPassword,
  updatePassword,
  updatePassword,
  sendCode,
  verifyCode,
  login,
};
