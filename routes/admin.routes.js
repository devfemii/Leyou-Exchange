const express = require("express");
const {
  getUser,
  uploadGiftCards,
  getUsers,
  getGiftCardTransaction,
  getGiftcardTransactions,
  getWalletTransaction,
  getWalletTransactions,
  registerAdmin,
  adminLogin,
  giftCardTransanctionDecision,
  walletTransanctionDecision,
} = require("../controllers/admin.controller");
const adminAuth = require("../middleware/admin-auth.middleware");

const router = express.Router();

router.post("/giftcard", uploadGiftCards);
router.get("/user/:id", adminAuth, getUser); // noted
router.get("/users", adminAuth, getUsers); // noted
router.get("/giftcardtransaction/:id", adminAuth, getGiftCardTransaction);
router.get("/giftcardtransactions", adminAuth, getGiftcardTransactions); // noted
router.get("/Wallettransaction/:id", adminAuth, getWalletTransaction);
router.get("/Wallettransactions", adminAuth, getWalletTransactions);
router.patch(
  "decidegiftcardtransanction",
  adminAuth,
  giftCardTransanctionDecision
);
router.patch("decidewallettransanction", adminAuth, walletTransanctionDecision);
router.post("/register", registerAdmin); // adding the auth middleware on the register endpoint noted
router.post("/login", adminLogin); //noted

module.exports = router;
