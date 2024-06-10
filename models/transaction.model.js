const mongoose = require("mongoose");

const GiftcardTransactionSchema = new mongoose.Schema(
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

const WalletTransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    from: {
      type: String,
      default: null,
    },
    recipient: {
      type: String,
      default: null,
    },
    reference: {
      type: String,
      default: null,
    },
    amount: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const WalletTransactionModel = mongoose.model(
  "wallet_transaction",
  WalletTransactionSchema
);
const GiftCardTransactionModel = mongoose.model(
  "giftcard_transaction",
  GiftcardTransactionSchema
);

module.exports = { GiftCardTransactionModel, WalletTransactionModel };
