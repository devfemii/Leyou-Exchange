const express = require("express");
const { sendMessages } = require("../controllers/conversation.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.post("/message/send", authMiddleware, sendMessages);

module.exports = router;
