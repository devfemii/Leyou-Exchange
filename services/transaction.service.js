const { GiftCardTransactionModel } = require("../models/transaction.model");
const User = require("../models/user.model");

const { updateUserAccount, existingUser } = require("../services/user.service");

const { newError } = require("../utils");

const saveTransaction = async (
  userId,
  giftCardCategory,
  giftCardSubCategory,
  giftCardAmount,
  giftCardValue,
  comment,
  giftCardImages
) => {
  // store outside car photo in array
  let giftCards = [];
  giftCardImages.forEach((giftCardImage) => {
    giftCards.push(giftCardImage.buffer);
  });

  if (giftCardImages.length > 12) {
    return newError("Too many files uploaded", 400);
  }

  try {
    const transaction = await GiftCardTransactionModel.create({
      giftCardCategory,
      giftCardSubCategory,
      giftCardAmount,
      giftCardValue,
      comment,
      giftCards,
    });

    await updateUserAccount(
      { _id: userId },
      {
        $push: {
          transactionHistory: {
            transaction: transaction._id,
            status: "processing",
            tag: "sell_gift_card",
          },
        },
      }
    );
  } catch (error) {
    return newError(error.message, error.status);
  }
};

const getTransactionHistory = async (userId) => {
  try {
    const transactions = await User.findOne({ _id: userId }).populate(
      "transactionHistory.transaction"
    );

    return transactions;
  } catch (error) {
    return newError(error.message, error.status);
  }
};

module.exports = {
  saveTransaction,
  getTransactionHistory,
};
