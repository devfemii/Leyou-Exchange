const express = require("express");
const router = express.Router();

//<-------- import modules -------->
const authMiddleware = require("../middleware/auth.middleware");
const { getNotifications, saveFCMToken } = require("../controllers/notification.controller");

router.get("/", authMiddleware, getNotifications);
router.post("/save-fcm-token/:FCMToken", authMiddleware, saveFCMToken);

module.exports = router;
