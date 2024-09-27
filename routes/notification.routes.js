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

//<-------- endpoint for testing of push notification-------->
router.post("/send-push-notification", authMiddleware, async (req, res) => {
  const { FCMToken, title, body } = req.body;
  const response = await sendPushNotification({ FCMToken }, { title, body });
  res.status(201).json(sendSuccessMessage({ message: "Push notification sent", response }, 201));
});
module.exports = router;
