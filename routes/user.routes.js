const express = require("express");
const {
  toggleBalanceVisibility,
  getGiftCards,
  rankGiftCards,
  getLeaderBoard,
} = require("../controllers/user.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.patch(
  "/balance/toggle-visibility",
  authMiddleware,
  toggleBalanceVisibility
);

router.get("/giftcards/rank", authMiddleware, rankGiftCards);
router.get("/giftcards", authMiddleware, getGiftCards);
router.get("/leaderboard", getLeaderBoard);

module.exports = router;
