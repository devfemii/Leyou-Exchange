const { saveTransaction } = require("../services/transaction.service");
const { sendSuccessMessage, sendErrorMessage } = require("../utils");

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
      .status(error.status)
      .json(sendErrorMessage(error.message, error.status));
  }
};

module.exports = {
  tradeGiftCard,
};
