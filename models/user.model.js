const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let bcryptSalt = process.env.BCRYPT_SALT;

// schema for transaction history
const transactionSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
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
  isEmailVerified: {
    type: Boolean,
    default: null,
  },
  transactionPin: {
    type: String,
    default: null,
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notification",
      default: [],
    },
  ],
  transactionHistory: [transactionSchema],
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
