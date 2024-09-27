const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { BadRequestError } = require("../errors");
const {
  GiftCardTransactionModel: GiftCardTransaction,
  WalletTransactionModel: WalletTransaction,
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
  try {
    let giftCards = [];
    for (let index = 0; index < giftCardImages.length; index++) {
      const imagePath = giftCardImages[index].path;
      const uploadFolder = "Leyou-Exchange/giftCardImages";
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: uploadFolder,
        use_filename: true,
      });
      giftCards.push(result.secure_url);
    }
    return;
    const transaction = await GiftCardTransaction.create({
      giftCardCategory,
      giftCardSubCategory,
      giftCardAmount,
      giftCardValue,
      comment,
      giftCardImages: giftCards,
      user: userId,
    });

    await updateUserAccount(
      { _id: userId },
      {
        $push: {
          giftCardTransactionHistory: {
            transaction: transaction._id,
            status: "pending",
            tag: "sell_gift_card",
          },
        },
      }
    );

    const referrer = await existingUser({
      "referredUsers.user": userId,
    });
    if (!referrer) {
      return;
    }

    // change the status of the referral
    referrer.referredUsers.forEach((referredUser) => {
      if (referredUser.user.toString() == userId.toString()) {
        referredUser.hasMadeFirstTrade = true;
      }
    });

    // add some point to the referral total point and balance
    const totalPoint = Number(referrer.referralTotalPoints) + 1;
    const totalPointBalance = Number(referrer.referralPointsBalance) + 1;

    // update the user referral data
    referrer.referralTotalPoints = totalPoint.toString();
    referrer.referralPointsBalance = totalPointBalance.toString();

    await referrer.save();
  } catch (error) {
    throw new Error(error);
  } finally {
    for (let index = 0; index < giftCardImages.length; index++) {
      const imagePath = giftCardImages[index].path;
      fs.unlinkSync(imagePath);
    }
  }
};

const createWalletTransaction = async (userId, transactionPin, amount, bankDetails) => {
  try {
    const wallet = await Wallet.findOne({ userId: userId });

    if (wallet.balance < Number(amount)) {
      return newError("Insufficient balance", 400);
    }

    if (wallet.transactionPin != transactionPin) {
      return newError("Incorrect PIN entered. If you have forgotten your PIN, click “Forgot PIN”", 400);
    }

    const transaction = await WalletTransaction.create({
      amount: amount,
      bankDetail: bankDetails,
      user: userId,
    });

    await updateUserAccount(
      { _id: userId },
      {
        $push: {
          walletTransactionHistory: {
            transaction: transaction._id,
            tag: "wallet_withdrawal",
            status: "pending",
          },
        },
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const getWalletTransactionHistory = async (userId) => {
  try {
    const transactions = await User.findOne({ _id: userId }).populate("walletTransactionHistory.transaction");

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
