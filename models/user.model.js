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
    required: [true, "Please provide your trade with"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
  },
  name: {
    type: String,
    required: [true, "Please provide your  name"],
  },
  userName: {
    type: String,
    required: [true, "Please provide your username"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
  },
  isBalanceVisible: {
    type: Boolean,
    default: false,
  },
  referralCode: {
    type: String,
    required: [true, "Please provide your referral code"],
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
