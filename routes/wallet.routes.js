const express = require("express");
const {
  listBank,
  balance,
  deleteBankDetails,
  addBank,
  verifyCustomer,
  getWallet,
  changePin,
} = require("../controllers/wallet.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/banks", listBank);
router.get("/", authMiddleware, getWallet);
router.get("/customer/verify", verifyCustomer);
router.post("/bank", authMiddleware, addBank);
router.delete("/bank", authMiddleware, deleteBankDetails);

router.patch("/change-pin", authMiddleware, changePin);
// router.get("/history", authMiddleware, transactionHistory);

module.exports = router;
