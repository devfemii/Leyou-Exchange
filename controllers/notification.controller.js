const { getNotificationsByUserId } = require("../services/notification.service");
const { sendErrorMessage, sendSuccessMessage } = require("../utils");
const User = require("../models/user.model");
const getNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsByUserId({
      userId: req.decoded.id,
    });

    return res.status(201).json(sendSuccessMessage(notifications, 201));
  } catch (error) {
    return res.status(error.status).json(sendErrorMessage(error.message, error.status));
  }
};

//<-------- save the FCM token ------>
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
