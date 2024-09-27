const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const { BadRequestError, NotFoundError } = require("../errors");
const { sendSuccessMessage } = require("../utils");
const sendPushNotification = require("../utils/sendPushNotification");

//<------- This controller is responsible for saving notification to database and sending as push notification -------->
const sendNotification = async (user, { type, tag, title, body }) => {
  if (!title || !body) {
    throw new BadRequestError("Please provide Notification title and body");
  }
  const notification = new Notification({ userId: user._id, type, tag, title, body });
  await notification.save();
  await sendPushNotification(user, notification);
};
const getNotifications = async (req, res) => {
  const userId = req.decoded.id;
  try {
    const notifications = await Notification.find({ userId });
    const unreadNotifications = notifications.filter((notification) => notification.status === "unread");
    return res.status(200).json(
      sendSuccessMessage(
        {
          totalNotifications: notifications.length,
          totalUnreadNotifications: unreadNotifications.length,
          totalReadNotifications: notifications.length - unreadNotifications.length,
          notifications,
        },
        200
      )
    );
  } catch (error) {
    throw new Error(error);
  }
};

const updateNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { status } = req.body;
  if (!status) {
    throw new BadRequestError("Please provide Notification status");
  }
  if (status !== "read" && status !== "unread") {
    throw new BadRequestError("Please valid Notification status ( read or unread )");
  }

  let notification = await Notification.findById(notificationId);

  if (status && status === notification.status) {
    return res.status(200).json(sendSuccessMessage("No changes made, state is already up-to-date.", 200));
  }

  notification = await Notification.findByIdAndUpdate(notificationId, { status }, { new: true });
  return res.status(200).json(
    sendSuccessMessage(
      {
        notification,
      },
      200
    )
  );
};

const saveFCMToken = async (req, res) => {
  const { FCMToken } = req.body;
  if (!FCMToken) {
    throw new BadRequestError("Please supply token");
  }
  const userId = req.decoded.id;
  try {
    const user = await User.findByIdAndUpdate(userId, { FCMToken }, { new: true });
    return res.status(200).json(sendSuccessMessage("The FCM token has been successfully saved", 200));
  } catch (error) {
    throw new Error(error);
  }
};

const sendNotificationToUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User cannot be found");
  }
  await sendNotification(user, { ...req.body });
  return res.status(200).json(sendSuccessMessage("Notification has been sent to user", 200));
};

module.exports = {
  sendNotificationToUser,
  getNotifications,
  updateNotification,
  saveFCMToken,
};
