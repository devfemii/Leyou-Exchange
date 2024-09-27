const express = require("express");
const router = express.Router();

//<-------- import modules -------->
const authMiddleware = require("../middleware/auth.middleware");
const {
  getNotifications,
  updateNotification,
  saveFCMToken,
} = require("../controllers/notification.controller");
const { fetchNotificationDetails } = require("../utils/notification");
const sendPushNotification = require("../utils/sendPushNotification");
const { sendSuccessMessage } = require("../utils");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");

//<------- routes -------->
router.get("/", authMiddleware, getNotifications);
router.post("/update-notification/:notificationId", authMiddleware, updateNotification);
router.post("/save-fcm-token", authMiddleware, saveFCMToken);

//<-------- test -------->
router.post("/send-push-notification", authMiddleware, async (req, res) => {
  const user = await User.findById(req.decoded.id);
  //<------- SEND A PUSH NOTIFICATION TO THE USER DEVICE ------->
  const notificationDetails = await fetchNotificationDetails("test", {});
  //<-------- save the notification to the database ------->
  const notification = new Notification({ userId: user._id, ...notificationDetails });
  await notification.save();
  await sendPushNotification(user, notification);
  res.status(201).json(sendSuccessMessage("Push notification sent", 201));
});
module.exports = router;
