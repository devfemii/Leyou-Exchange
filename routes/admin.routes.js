const express = require("express");
const { getUser, uploadGiftCards, getUsers, getGiftCardTransaction, getAllGiftCardTransactions, getGiftcardTransactions, getWalletTransaction, getWalletTransactions, registerAdmin, adminLogin, giftCardTransanctionDecision, walletTransanctionDecision, getAllPendingGiftcardTransactions, getAllPendingWalletTransactions, getAllCompletedGiftcardTransactions, getAllCompletedWalletTransactions, getAllUsersRefferals } = require("../controllers/admin.controller");
const adminAuth = require("../middleware/admin-auth.middleware");

const router = express.Router();

router.post("/giftcard", uploadGiftCards);
router.get("/user/:id", adminAuth, getUser);
router.get("/users", adminAuth, getUsers);
router.get("/numberofreferrals", adminAuth, getAllUsersRefferals);
router.get("/pendinggiftcardtransactions", adminAuth, getAllPendingGiftcardTransactions);
router.get("/pendingwallettransactions", adminAuth, getAllPendingWalletTransactions);
router.get("/completedgiftcardtransactions", adminAuth, getAllCompletedGiftcardTransactions);
router.get("/completedwallettransactions", adminAuth, getAllCompletedWalletTransactions);
router.get("/giftcardtransaction/:id", adminAuth, getGiftCardTransaction);
router.get("/giftcardtransactions", adminAuth, getGiftcardTransactions);
router.get("/Wallettransaction/:id", adminAuth, getWalletTransaction);
router.get("/Wallettransactions", adminAuth, getWalletTransactions);
router.patch("decidegiftcardtransanction", adminAuth, giftCardTransanctionDecision);
router.patch("decidewallettransanction", adminAuth, walletTransanctionDecision);
router.post("/registeradmin", adminAuth, registerAdmin);
router.post("/adminlogin", adminLogin);


module.exports = router;
