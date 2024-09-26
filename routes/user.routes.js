const express = require("express");
const {
  toggleBalanceVisibility,
  getGiftCards,
  rankGiftCards,
  getLeaderBoard,
  updateUserProfile,
  getReferralDetails,
  verifyUserIdentity,
  deleteUserAccount,
  getStreamToken,
} = require("../controllers/user.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const imageValidatorMiddleware = require("../middleware/image.validation.middleware");

//<--------- refactored routes start here --------->
router.post(
  "/profile/update",
  authMiddleware,
  imageValidatorMiddleware.single("profilePicture"),
  updateUserProfile
);
router.get("/chat/get-token", authMiddleware, getStreamToken);
router.get("/referrals", authMiddleware, getReferralDetails);
router.patch("/identity-verification", authMiddleware, verifyUserIdentity);
router.delete("/", authMiddleware, deleteUserAccount);
//<--------- refactored routes end here --------->
router.patch("/balance/toggle-visibility", authMiddleware, toggleBalanceVisibility);
router.get("/giftcards/rank", authMiddleware, rankGiftCards);
router.get("/giftcards", authMiddleware, getGiftCards);
router.get("/leaderboard", getLeaderBoard);


module.exports = router;
