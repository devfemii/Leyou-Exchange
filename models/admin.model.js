const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let bcryptSalt = process.env.BCRYPT_SALT;

const AdminSchema = new mongoose.Schema({
  socketId: {
    type: String,
    default: null,
  },
  email: {
    unique: true,
    type: String,
    required: [true, "Please provide email address"],
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  userName: {
    type: String,
    unique: true,
    required: [true, "Please provide userName"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide phoneNumber"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },

  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notification",
      default: [],
    },
  ],
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (this.password && !this.password.startsWith("$2b")) {
    const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
    this.password = hash;
  }

  next();
});

const Admin = mongoose.model("admin", AdminSchema);
module.exports = Admin;
