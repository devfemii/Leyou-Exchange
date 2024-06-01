const Transaction = require("../models/transaction.model");
const { newError } = require("../utils");

const saveTransaction = async (
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
    await Transaction.create({
      giftCardCategory,
      giftCardSubCategory,
      giftCardAmount,
      giftCardValue,
      comment,
      giftCards,
    });
  } catch (error) {
    return newError(error.message, error.status);
  }
};

module.exports = {
  saveTransaction,
};
