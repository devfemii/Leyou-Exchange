//<-------- import modules -------->
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const adminAuthMiddleware = require("../middleware/admin-auth.middleware");
const {
  getNotifications,
  updateNotification,
  saveFCMToken,
  sendNotificationToUser,
} = require("../controllers/notification.controller");
const sendPushNotification = require("../utils/sendPushNotification");
const { sendSuccessMessage } = require("../utils");

//<------- routes -------->
router.get("/", authMiddleware, getNotifications);
router.post("/update-notification/:notificationId", authMiddleware, updateNotification);
router.post("/save-fcm-token", authMiddleware, saveFCMToken);
router.post("/send/:userId", adminAuthMiddleware, sendNotificationToUser); //route for sending notification to a single user

//<-------- endpoint for testing of push notification-------->
router.post("/send-push-notification", async (req, res) => {
  const { FCMToken, title, body } = req.body;
  const response = await sendPushNotification({ FCMToken }, { title, body });
  res.status(201).json(sendSuccessMessage({ message: "Push notification sent", response }, 201));
});
module.exports = router;
