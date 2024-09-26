const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    title: { type: String, default: null, required: true },
    body: { type: String, default: null, required: true },
    status: {
      type: String,
      default: "not_seen",
      required: true,
    },
  },
  { timestamps: true }
);
const Notification = mongoose.model("notification", NotificationSchema);
module.exports = Notification;
