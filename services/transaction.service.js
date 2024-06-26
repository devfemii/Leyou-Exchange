const {
  GiftCardTransactionModel,
  WalletTransactionModel,
} = require("../models/transaction.model");
const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");

const { updateUserAccount, existingUser } = require("../services/user.service");

const { newError } = require("../utils");

const createGiftcardTransaction = async (
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
          giftCardTransactionHistory: {
            transaction: transaction._id,
            status: "processing",
            tag: "sell_gift_card",
          },
        },
      }
    );

    const referree = await existingUser({
      "referredUsers.user": userId,
    });

    // change the status of the referral
    referree.referredUsers.forEach((referredUser) => {
      if (referredUser.user.toString() == userId.toString()) {
        referredUser.hasMadeFirstTrade = true;
      }
    });

    // add some point to the referral total point and balance
    const totalPoint = Number(referree.referralTotalPoints) + 1;
    const totalPointBalnce = Number(referree.referralPointsBalance) + 1;

    // update the user referral data
    referree.referralTotalPoints = totalPoint.toString();
    referree.referralPointsBalance = totalPointBalnce.toString();

    referree.save();
  } catch (error) {
    return newError(error.message, error.status);
  }
};

const createWalletTransaction = async (
  userId,
  transactionPin,
  amount,
  bankDetails
) => {
  try {
    const wallet = await Wallet.findOne({ userId: userId });

    if (wallet.balance < Number(amount)) {
      return newError("Insufficient balance", 400);
    }

    if (wallet.transactionPin != transactionPin) {
      return newError(
        "Incorrect PIN entered. If you have forgotten your PIN, click “Forgot PIN”",
        400
      );
    }

    const transaction = await WalletTransactionModel.create({
      amount: amount,
      bankDetail: bankDetails,
    });

    await updateUserAccount(
      { _id: userId },
      {
        $push: {
          walletTransactionHistory: {
            transaction: transaction._id,
            tag: "wallet_withdrawal",
            status: "processing",
          },
        },
      }
    );
  } catch (error) {
    return newError(error.message, error.status);
  }
};

const getWalletTransactionHistory = async (userId) => {
  try {
    const transactions = await User.findOne({ _id: userId }).populate(
      "walletTransactionHistory.transaction"
    );

    return transactions;
  } catch (error) {
    return newError(error.message, error.status);
  }
};

const getTransactionHistory = async (userId) => {
  try {
    const transactions = await User.findOne({ _id: userId }).populate(
      "giftCardTransactionHistory.transaction"
    );

    return transactions;
  } catch (error) {
    return newError(error.message, error.status);
  }
};

module.exports = {
  createGiftcardTransaction,
  getTransactionHistory,
  createWalletTransaction,
  getWalletTransactionHistory,
};
