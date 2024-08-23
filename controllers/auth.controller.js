const {
  createUserAccount,
  forgetUserPassword,
  loginUser,
  sendCodeToEmail,
  verifyCodeFromEmail,
  verifiedEmailForPasswordReset,
  updateUserPassword,
} = require("../services/auth.service");

const { existingUser, updateUserAccount } = require("../services/user.service");
const { updateWallet } = require("../services/wallet.services");
const { sendErrorMessage, sendSuccessMessage, newError } = require("../utils");

const register = async (req, res) => {
  const { tradeWith, email, name, userName, phoneNumber, password, referralCode } = req.body;

  try {
    const newUser = await createUserAccount(tradeWith, email, password, name, userName, phoneNumber);

    if (referralCode && referralCode.length === 8) {
      const user = await existingUser({ referralCode });

      if (!user.referralCode) {
        return newError("Referral Code not found", 400);
      }

      if (user.referralCode == newUser.referralCode) {
        return newError("You cannot refer yourself", 400);
      }

      await updateUserAccount(
        { _id: user._id },
        {
          $push: {
            referredUsers: {
              user: newUser,
              isRegisteredSuccessfully: true,
              hasMadeFirstTrade: false,
            },
          },
        }
      );
    }

    return res.status(201).json(
      sendSuccessMessage(
        {
          userId: newUser._id,
          message:
            "Thanks for joining, you can now enjoy seamless trading of gift cards to naira to our platform.",
        },
        201
      )
    );
  } catch (error) {
    throw new Error(error);
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const response = await loginUser(userName, password);

    return res.status(200).json(
      sendSuccessMessage(
        {
          userDetails: {
            name: response.user.name,
            email: response.user.email,
            tradeWith: response.user.tradeWith,
            userName: response.user.userName,
            phoneNumber: response.user.phoneNumber,
            referralCode: response.user.referralCode,
          },
          token: response.token,
        },
        201
      )
    );
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status));
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    await forgetUserPassword(email);
    return res.status(201).json(sendSuccessMessage("Reset link sent successfully", 200));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status));
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
    return res.status(error.status).json(sendErrorMessage(error.message, error.status));
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
    return res.status(error.status).json(sendErrorMessage(error.message, error.status));
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
    return res.status(error.status).json(sendErrorMessage(error.message, error.status));
  }
};

const updatePassword = async (req, res) => {
  const { id, currentPassword, password } = req.body;
  try {
    await updateUserPassword(id, currentPassword, password);

    res
      .status(200)
      .json(sendSuccessMessage("you have successfully updated your password, proceed to login", 200));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status));
  }
};

const createTransactionPin = async (req, res) => {
  const { userId, transactionPin } = req.body;
  try {
    await updateWallet(userId, transactionPin);

    return res.status(201).json(sendSuccessMessage("Pin created successfully", 201));
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const changePin = async () => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  createTransactionPin,
  verifiedEmailPasswordReset,
  forgetPassword,
  updatePassword,
  updatePassword,
  changePin,
  sendCode,
  verifyCode,
  login,
};
