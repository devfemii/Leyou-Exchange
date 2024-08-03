const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let bcryptSalt = process.env.BCRYPT_SALT;



const AdminSchema = new mongoose.Schema({
  socketId: {
    type: String,
    default: null,
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
