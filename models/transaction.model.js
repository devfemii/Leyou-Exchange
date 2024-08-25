const mongoose = require("mongoose");

const GiftcardTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
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

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "declined", "accepted"],
    },
  },

  {
    timestamps: true,
  }
);

const WalletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    amount: {
      type: String,
      default: null,
    },
    bankDetail: {
      accountName: {
        type: String,
        default: null,
      },
      bankName: {
        type: String,
        default: null,
      },
      accountNumber: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "declined", "accepted"],
    },
  },
  {
    timestamps: true,
  }
);

const WalletTransactionModel = mongoose.model("wallet_transaction", WalletTransactionSchema);
const GiftCardTransactionModel = mongoose.model("giftcard_transaction", GiftcardTransactionSchema);

module.exports = { GiftCardTransactionModel, WalletTransactionModel };
