const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    giftCardCategory: {
      type: String,
      default: null,
      required: true,
    },
    giftCardSubCategory: {
      type: String,
      default: null,
      required: true,
    },
    giftCardAmount: {
      type: String,
      default: null,
      required: true,
    },
    giftCardValue: {
      type: String,
      default: null,
      required: true,
    },
    comment: {
      type: String,
      default: null,
    },
    giftCardImages: [
      {
        type: Buffer,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("transaction", TransactionSchema);
module.exports = Transaction;
