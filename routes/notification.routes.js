const express = require("express");
const router = express.Router();

//<-------- import modules -------->
const authMiddleware = require("../middleware/auth.middleware");
const {
  getNotifications,
  updateNotification,
  saveFCMToken,
} = require("../controllers/notification.controller");

//<------- routes -------->
router.get("/", authMiddleware, getNotifications);
router.post("/update-notification/:notificationId", authMiddleware, updateNotification);
router.post("/save-fcm-token", authMiddleware, saveFCMToken);

module.exports = router;
