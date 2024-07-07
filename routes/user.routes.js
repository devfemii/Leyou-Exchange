const express = require("express");
const {
  toggleBalanceVisibility,
  getGiftCards,
  rankGiftCards,
  getLeaderBoard,
  updateUserProfile,
  getReferralDetails,
  verifyUserIdentity,
} = require("../controllers/user.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const imageValidatorMiddleware = require("../middleware/image.validation.middleware");

router.patch(
  "/balance/toggle-visibility",
  authMiddleware,
  toggleBalanceVisibility
);

router.get("/giftcards/rank", authMiddleware, rankGiftCards);
router.get("/giftcards", authMiddleware, getGiftCards);
router.get("/leaderboard", getLeaderBoard);
router.post(
  "/profile/update",
  authMiddleware,
  imageValidatorMiddleware.single("profilePic"),
  updateUserProfile,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.patch("/identity-verification", authMiddleware, verifyUserIdentity);
router.get("/referrals", authMiddleware, getReferralDetails);

module.exports = router;
