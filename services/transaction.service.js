const {
  GiftCardTransactionModel,
  WalletTransactionModel,
  referralPointTransactioModel,
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

    if (referree) {
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
    }
  } catch (error) {
    return newError(error.message, error.status);
  }
};

const redeemPointTransaction = async (userId, point, value) => {
  try {
    const user = await existingUser({ _id: userId });

    if (Number(user.referralPointsBalance) < Number(point)) {
      return newError(
        "Insufficient point, refer more customers to gain more points",
        400
      );
    }

    // create a referral transaction endpoint
    const transaction = await referralPointTransactioModel.create({
      point,
      value,
    });

    // find a wallet
    const wallet = await Wallet.findOne({ userId });

    // update the user wallet
    await Wallet.findOneAndUpdate(
      { userId },
      {
        balance: Number(wallet.balance) + Number(value),
      }
    );

    // update the user data
    await updateUserAccount(
      { _id: userId },
      {
        $push: {
          redeemedPoint: {
            transaction: transaction._id,
          },
        },
        referralPointsBalance: (
          Number(user.referralPointsBalance) - Number(point)
        ).toString(),
      }
    );
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

    if (Number(wallet.balance) < Number(amount)) {
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
    const user = await User.findById(userId)
      .populate("walletTransactionHistory.transaction")
      .exec();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
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

const changePin = async (userId, oldPin, newPin) => {
  const wallet = await Wallet.findOne({ userId: userId });

  if (!wallet) {
    return { success: false, message: "Wallet not found" };
  }

  if (wallet.transactionPin !== oldPin) {
    return { success: false, message: "Old PIN is incorrect" };
  }

  await Wallet.findOneAndUpdate(
    { userId: userId },
    { transactionPin: newPin },
    { new: true }
  );
  return { success: true };
};

module.exports = {
  createGiftcardTransaction,
  getTransactionHistory,
  createWalletTransaction,
  getWalletTransactionHistory,
  redeemPointTransaction,
  changePin,
};
