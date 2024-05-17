const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  email: {
    type: String,
    default: null,
  },
  OTP: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 1200, // Expires in 1200 seconds (20 minutes)
  },
});

// setup model on mongoose
const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
