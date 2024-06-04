const {
  saveTransaction,
  getTransactionHistory,
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
    await saveTransaction(
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
      .json(sendSuccessMessage(transactions.transactionHistory, 200));
  } catch (error) {
    return res
      .status(error.status ?? 500)
      .json(sendErrorMessage(error.message, error.status ?? 500));
  }
};

module.exports = {
  tradeGiftCard,
  transactionHistory,
};
