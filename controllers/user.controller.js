const {
  updateUserAccount,
  checkIfEmailAndUsernameExist,
  existingUser,
  getLeaderBoardFromDB,
  getUserReferral,
} = require("../services/user.service");
const {
  findAllGiftCards,
  rankGiftCardFromAdminsRate,
} = require("../services/admin.service");
const { sendErrorMessage, sendSuccessMessage, newError } = require("../utils");

const toggleBalanceVisibility = async (req, res) => {
  try {
    const user = await existingUser({ _id: req.decoded.id });

    const updatedBalanceVisibility = await updateUserAccount(
      { _id: req.decoded.id },
      { isBalanceVisible: !user.isBalanceVisible }
    );

    return res
      .status(201)
      .json(sendSuccessMessage(updatedBalanceVisibility.isBalanceVisible, 201));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getGiftCards = (req, res) => {
  try {
    const giftCards = findAllGiftCards();
    return res.status(200).json(sendSuccessMessage(giftCards, 200));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const rankGiftCards = (req, res) => {
  try {
    const rankedGiftCard = rankGiftCardFromAdminsRate();
    return res.status(200).json(sendSuccessMessage(rankedGiftCard, 200));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getLeaderBoard = async (req, res) => {
  try {
    const usersFromLeaderBorad = await getLeaderBoardFromDB();
    return res.status(200).json(sendSuccessMessage(usersFromLeaderBorad, 200));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const getReferralDetails = async (req, res) => {
  try {
    const userReferral = await getUserReferral(req.decoded.id);
    return res.status(200).json(sendSuccessMessage(userReferral, 200));
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const verifyUserIdentity = async (req, res) => {
  const { dateOfBirth, bankVerificationNumber } = req.body;
  try {
    await updateUserAccount(
      { _id: req.decoded.id },
      { dateOfBirth, bankVerificationNumber }
    );

    return res
      .status(200)
      .json(
        sendSuccessMessage(
          "your BVN verification is processing, you will get feedback in 2 business days",
          200
        )
      );
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const updateUserProfile = async (req, res) => {
  const { email, userName, phoneNumber, dateOfBirth, bankVerificationNumber } =
    req.body;
  try {
    const user = await existingUser({ _id: req.decoded.id });

    const checkIfDetaillExist = await checkIfEmailAndUsernameExist(
      user.email,
      user.userName
    );

    const emails = checkIfDetaillExist.userEmails;
    const userNames = checkIfDetaillExist.userNames;

    emails.forEach((e) => {
      if (e == email) {
        return newError("Email already exist", 400);
      }
    });

    userNames.forEach((u) => {
      if (u == userName) {
        return newError("UserName already exist", 400);
      }
    });

    await updateUserAccount(
      { _id: req.decoded.id },
      { email, userName, phoneNumber, dateOfBirth, bankVerificationNumber }
    );

    return res
      .status(200)
      .json(
        sendSuccessMessage("You profile has been successfully updated", 200)
      );
  } catch (error) {
    return res
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = {
  toggleBalanceVisibility,
  getGiftCards,
  rankGiftCards,
  getLeaderBoard,
  updateUserProfile,
  getReferralDetails,
  verifyUserIdentity,
};
