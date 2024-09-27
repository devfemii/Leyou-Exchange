const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "general",
      enum: ["general", "update", "activity"],
      required: true,
    },
    tag: {
      type: String,
      default: null,
      enum: ["transaction_approved", "transaction_rejected", "transaction_pending"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    title: { type: String, default: null, required: true },
    body: { type: String, default: null, required: true },
    status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
      required: true,
    },
  },
  { timestamps: true }
);
const Notification = mongoose.model("notification", NotificationSchema);
module.exports = Notification;
