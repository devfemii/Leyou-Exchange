const express = require("express");
const {
  adminLogin,
  registerAdmin,
  getDashBoard,
  getUsers,
  getUser,
  getTransactions,
  getTransaction,
  getAllUsersRefferals,
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
router.get("/transactions", adminAuth, getTransactions);
router.get("/transaction/:transactionId", adminAuth, getTransaction);
router.get("/numberofreferrals", adminAuth, getAllUsersRefferals);

router.patch("decidegiftcardtransanction", adminAuth, giftCardTransanctionDecision);
router.patch("decidewallettransanction", adminAuth, walletTransanctionDecision);

module.exports = router;
