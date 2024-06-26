const {
  updateUserAccount,
  existingUser,
  getLeaderBoardFromDB,
} = require("../services/user.service");
const {
  findAllGiftCards,
  rankGiftCardFromAdminsRate,
} = require("../services/admin.service");
const { sendErrorMessage, sendSuccessMessage } = require("../utils");

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

module.exports = {
  toggleBalanceVisibility,
  getGiftCards,
  rankGiftCards,
  getLeaderBoard,
};
