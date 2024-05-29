const express = require("express");
const { toggleBalanceVisibility } = require("../controllers/user.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.patch(
  "/balance/toggle-visibility",
  authMiddleware,
  toggleBalanceVisibility
);

module.exports = router;
