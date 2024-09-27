const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const { sendSuccessMessage } = require("../utils");

const getNotifications = async (req, res) => {
  const userId = req.decoded.id;
  try {
    const notifications = await Notification.find({ userId });
    const unreadNotifications = notifications.filter((notification) => notification.status === "unread");
    return res.status(201).json(
      sendSuccessMessage(
        {
          totalNotifications: notifications.length,
          totalUnreadNotifications: unreadNotifications.length,
          notifications,
        },
        201
      )
    );
  } catch (error) {
    throw new Error(error);
  }
};

const saveFCMToken = async (req, res) => {
  const { FCMToken } = req.params;
  const userId = req.decoded.id;
  try {
    const user = await User.findByIdAndUpdate(userId, { FCMToken }, { new: true });
    return res.status(200).json(sendSuccessMessage("The FCM token has been successfully saved", 200));
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getNotifications,
  saveFCMToken,
};
