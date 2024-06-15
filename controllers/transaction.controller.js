const {
  createGiftcardTransaction,
  getTransactionHistory,
  createWalletTransaction,
} = require("../services/transaction.service");
const { sendSuccessMessage, sendErrorMessage, newError } = require("../utils");

const tradeGiftCard = async (req, res) => {
  const {
    giftCardCategory,
    giftCardSubCategory,
    giftCardAmount,
    giftCardValue,
    comment,
  } = req.body;

  try {
    if (req.files.length == 0) {
      return newError(
        "Please upload a valid image file with either jpg, jpeg, png, or gif extension",
        400
      );
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
        sendSuccessMessage(
          "Your gift card transaction is now processing. We wll notify you shortly",
          200
        )
      );
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const transactionHistory = async (req, res) => {
  try {
    const transactions = await getTransactionHistory(req.decoded.id);

    if (!transactions) {
      return newError("Sorry you have not made any transaction yet", 404);
    }

    return res
      .status(200)
      .json(sendSuccessMessage(transactions.giftCardTransactionHistory, 200));
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

const withdrawFunds = async (req, res) => {
  const { transactionPin, amount, bankDetails } = req.body;

  try {
    await createWalletTransaction(
      req.decoded.id,
      transactionPin,
      amount,
      bankDetails
    );

    return res
      .status(200)
      .json(
        sendSuccessMessage(
          "Your withdrawal request is now processing. We wll notify you shortly",
          200
        )
      );
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = {
  tradeGiftCard,
  transactionHistory,
  withdrawFunds,
};
