const mongoose = require("mongoose");

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
      ref: "user",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    banks: [AddNewBankSchema],
  },
  { timestamps: true }
);

const Wallet = mongoose.model("wallet", WalletSchema);

module.exports = Wallet;
