const { getNotificationsByUserId } = require("../services/notification.service");
const { sendErrorMessage, sendSuccessMessage } = require("../utils");
const User = require("../models/user.model");
const FCMAdmin = require("../config/firebase");
const { BadRequestError } = require("../errors");
const getNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsByUserId({
      userId: req.decoded.id,
    });

    return res.status(201).json(sendSuccessMessage(notifications, 201));
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

const sendPushNotification = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      throw new BadRequestError("Please provide Notification title or body");
    }
    const userId = req.decoded.id;
    const user = await User.findById(userId);
    if (!user.FCMToken) {
      throw new BadRequestError("Please supply FCM token");
    }
    const message = {
      token: user.FCMToken,
      notification: {
        title,
        body,
      },
    };
    const response = await FCMAdmin.messaging().send(message);
    return res.status(200).json(sendSuccessMessage("Push notification sent", 200));
  } catch (error) {
    return res.status(400).json(sendErrorMessage(error, 400));
  }
};

module.exports = {
  getNotifications,
  saveFCMToken,
  sendPushNotification,
};
