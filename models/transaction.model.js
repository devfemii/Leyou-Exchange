const mongoose = require("mongoose");

const redeemedPointTransaction = new mongoose.Schema({
  point: {
    type: String,
    default: null,
  },
  value: {
    type: String,
    default: null,
  },
});

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

const referralPointTransactioModel = mongoose.model(
  "redeemed_point_transaction",
  redeemedPointTransaction
);

module.exports = {
  GiftCardTransactionModel,
  WalletTransactionModel,
  referralPointTransactioModel,
};
