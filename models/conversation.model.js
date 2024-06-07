const mongoose = require("mongoose");

const UserConversationsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      default: null,
    },
  ],
});

const ConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    conversations: [UserConversationsSchema],
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("conversation", ConversationSchema);
module.exports = Notification;
