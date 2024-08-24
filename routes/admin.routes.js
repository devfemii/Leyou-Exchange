const express = require("express");
const {
  getUsers,
  getUser,
  getDashBoard,
  registerAdmin,
  adminLogin,
  getAllUsersRefferals,
  uploadGiftCards,
  getGiftCardTransaction,
  getAllTransactions,
  getTransaction,
  getGiftcardTransactions,
  getWalletTransactions,
  getWalletTransaction,
  giftCardTransanctionDecision,
  walletTransanctionDecision,
} = require("../controllers/admin.controller");
const adminAuth = require("../middleware/admin-auth.middleware");

const router = express.Router();

//<---------- refactored routes ---------->
router.post("/register", registerAdmin);
router.post("/login", adminLogin);
router.get("/dashboard", getDashBoard);
router.get("/users", adminAuth, getUsers);
router.get("/user/:id", adminAuth, getUser);
router.get("/numberofreferrals", adminAuth, getAllUsersRefferals);
router.get("/all-transactions", adminAuth, getAllTransactions);
router.get("/giftcard-transactions", adminAuth, getGiftcardTransactions);
router.get("/wallet-transactions", adminAuth, getWalletTransactions);
router.get("/transaction/:transactionId", adminAuth, getTransaction);
router.get("/giftcardtransaction/:id", adminAuth, getGiftCardTransaction);
router.get("/Wallettransaction/:id", adminAuth, getWalletTransaction);

router.patch("decidegiftcardtransanction", adminAuth, giftCardTransanctionDecision);
router.patch("decidewallettransanction", adminAuth, walletTransanctionDecision);
router.post("/giftcard", uploadGiftCards);

module.exports = router;
