const mongoose = require("mongoose");

// schema for transaction history
const TransactionSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wallet_transaction",
    default: [],
  },
});

const AddNewBankSchema = new mongoose.Schema({
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
});

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    banks: [AddNewBankSchema],
    transactions: [TransactionSchema],
  },
  { timestamps: true }
);

const Wallet = mongoose.model("wallet", WalletSchema);

module.exports = Wallet;
