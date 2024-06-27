const User = require("../models/user.model");
const { newError } = require("../utils");

const existingUser = async (id) => {
  try {
    const existingUser = await User.findOne(id);
    return existingUser;
  } catch (error) {
    return newError("Connection timed out", 500);
  }
};

const updateUserAccount = async (id, payload) => {
  try {
    const updatedUser = await User.findOneAndUpdate(id, payload, { new: true });
    return updatedUser;
  } catch (error) {
    return newError(error.message, 500);
  }
};

const getLeaderBoardFromDB = async () => {
  try {
    const users = await User.find().populate(
      "giftCardTransactionHistory.transaction"
    );

    let getGiftCardsTotalTransaction = [];
    users.forEach((user) => {
      getGiftCardsTotalTransaction.push({
        user: user.userName,
        totalGiftCardTransactions: user.giftCardTransactionHistory.length,
      });
    });

    return getGiftCardsTotalTransaction.sort(
      (a, b) => b.totalGiftCardTransactions - a.totalGiftCardTransactions
    );
  } catch (error) {
    return newError(error.message, 500);
  }
};

module.exports = {
  existingUser,
  updateUserAccount,
  getLeaderBoardFromDB,
};
