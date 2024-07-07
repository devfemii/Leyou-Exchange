const User = require("../models/user.model");
const { newError } = require("../utils");

const existingUser = async (id) => {
  try {
    const existingUser = await User.findOne(id);
    return existingUser;
  } catch (error) {
    return newError(error.message, 500);
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

const deleteAccountFromDB = async (id) => {
  try {
    await User.findOneAndDelete({ _id: id });
  } catch (error) {
    return newError(error.message, 500);
  }
};

const getUserReferral = async (id) => {
  const users = await existingUser({ _id: id });
  users.populate("referredUsers.user");

  return users.referredUsers;
};

const checkIfEmailAndUsernameExist = async (email, userName) => {
  const users = await User.find();

  // get the username and emails
  const userEmails = [];
  const userNames = [];

  users.forEach((user) => {
    if (user.email != email) {
      userEmails.push(user.email);
    }

    if (user.userName != userName) {
      userNames.push(user.userName);
    }
  });

  return { userEmails, userNames };
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
  getUserReferral,
  deleteAccountFromDB,
  checkIfEmailAndUsernameExist,
};
