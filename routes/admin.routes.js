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
  updateTransaction,
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
router.patch("/update-transaction/:transactionId", adminAuth, updateTransaction);

module.exports = router;
