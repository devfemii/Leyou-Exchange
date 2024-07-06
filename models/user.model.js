const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let bcryptSalt = process.env.BCRYPT_SALT;

// schema for transaction history
const WalletTransactionSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wallet_transaction",
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  tag: {
    type: String,
    default: null,
  },
});

const RedeemedPointSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "redeemed_point_transaction",
    default: null,
  },
});

const GiftcardTransactionSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "giftcard_transaction",
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  tag: {
    type: String,
    default: null,
  },
});

const UserSchema = new mongoose.Schema({
  socketId: {
    type: String,
    default: null,
  },
  tradeWith: {
    type: String,
    default: null,
    required: true,
  },
  email: {
    type: String,
    default: null,
    required: true,
  },
  name: {
    type: String,
    default: null,
    required: true,
  },
  userName: {
    type: String,
    default: null,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: null,
    required: true,
  },
  password: {
    type: String,
    default: null,
    required: true,
  },
  isBalanceVisible: {
    type: Boolean,
    default: false,
  },
  referralCode: {
    type: String,
    default: null,
    required: true,
  },
  dateOfBirth: {
    type: String,
    default: null,
  },
  bankVerificationNumber: {
    type: String,
    default: null,
  },
  referredUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      isRegisteredSuccessfully: { type: Boolean },
      hasMadeFirstTrade: { type: Boolean },
    },
  ],
  referralTotalPoints: {
    type: String,
    default: 0,
  },
  referralPointsBalance: {
    type: String,
    default: 0,
  },
  isEmailVerified: {
    type: Boolean,
    default: null,
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notification",
      default: [],
    },
  ],
  giftCardTransactionHistory: [GiftcardTransactionSchema],
  walletTransactionHistory: [WalletTransactionSchema],
  redeemedPoint: [RedeemedPointSchema],
  canResetPassword: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (this.password && !this.password.startsWith("$2b")) {
    const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
    this.password = hash;
  }

  next();
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
