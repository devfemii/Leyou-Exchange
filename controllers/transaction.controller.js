const { BadRequestError } = require("../errors");
const { sendCodeToEmail, verifyCodeFromEmail } = require("../services/auth.service");
const {
  createGiftcardTransaction,
  getTransactionHistory,
  createWalletTransaction,
  getWalletTransactionHistory,
} = require("../services/transaction.service");

const { getUserWallet } = require("../services/wallet.services");
const { sendSuccessMessage, sendErrorMessage, newError } = require("../utils");

const tradeGiftCard = async (req, res) => {
  const { giftCardCategory, giftCardSubCategory, giftCardAmount, giftCardValue, comment } = req.body;
  try {
    if (req.files.length === 0) {
      throw new BadRequestError("error here");
      //return newError("Please upload a valid image file with either jpg, jpeg, png, or gif extension", 400);
    }

    await createGiftcardTransaction(
      req.decoded.id,
      giftCardCategory,
      giftCardSubCategory,
      giftCardAmount,
      giftCardValue,
      comment,
      req.files
    );

    return res
      .status(200)
      .json(
        sendSuccessMessage("Your gift card transaction is now processing. We wll notify you shortly", 200)
      );
  } catch (error) {
    throw new Error(error);
  }
};

const transactionHistory = async (req, res) => {
  try {
    const transactions = await getTransactionHistory(req.decoded.id);

    if (!transactions) {
      return newError("Sorry you have not made any transaction yet", 404);
    }

    return res.status(200).json(sendSuccessMessage(transactions.giftCardTransactionHistory, 200));
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const walletTransactionHistory = async (req, res) => {
  try {
    const transactions = await getWalletTransactionHistory(req.decoded.id);

    if (!transactions) {
      return newError("Sorry you have not made any transaction yet", 404);
    }

    return res.status(200).json(sendSuccessMessage(transactions.giftCardTransactionHistory, 200));
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const withdrawFunds = async (req, res) => {
  const { transactionPin, amount, bankDetails } = req.body;

  try {
    await createWalletTransaction(req.decoded.id, transactionPin, amount, bankDetails);

    return res
      .status(200)
      .json(sendSuccessMessage("Your withdrawal request is now processing. We wll notify you shortly", 200));
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const recoverTransactionPin = async (req, res) => {
  const { email, transactionPin } = req.body;

  try {
    await sendCodeToEmail(email);

    return res
      .status(200)
      .json(sendSuccessMessage("Your withdrawal request is now processing. We wll notify you shortly", 200));
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const verifyOTP = async (req, res) => {
  const { OTP } = req.body;

  try {
    await verifyCodeFromEmail(OTP);

    return res.status(200).json(sendSuccessMessage("Proceed to changing your transaction pin", 200));
  } catch (error) {
    return res.status(error.status ?? 500).json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const changeTransactionPin = async () => {
  try {
  } catch (error) {}
};

module.exports = {
  tradeGiftCard,
  transactionHistory,
  withdrawFunds,
  recoverTransactionPin,
  changeTransactionPin,
  walletTransactionHistory,
  verifyOTP,
};
