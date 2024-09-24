const express = require("express");
const router = express.Router();

//<-------- import modules -------->
const authMiddleware = require("../middleware/auth.middleware");
const {
  getNotifications,
  saveFCMToken,
  sendPushNotification,
} = require("../controllers/notification.controller");

//<------- routes -------->
router.get("/", authMiddleware, getNotifications);
router.post("/send-push-notification", authMiddleware, sendPushNotification);
router.post("/save-fcm-token/:FCMToken", authMiddleware, saveFCMToken);

module.exports = router;
