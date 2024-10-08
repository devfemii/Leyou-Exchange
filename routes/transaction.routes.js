const express = require("express");
const {
  tradeGiftCard,
  transactionHistory,
  withdrawFunds,
  recoverTransactionPin,
  changeTransactionPin,
  walletTransactionHistory,
  verifyOTP,
} = require("../controllers/transaction.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { uploadGiftCardImages } = require("../middleware/image.validation.middleware");

//<--------- refactored routes starts here ------->
router.post("/card/trade", authMiddleware, uploadGiftCardImages, tradeGiftCard);
//<-------- refactored routes ends here ------->

router.get("/history", authMiddleware, transactionHistory);
router.get("/wallet-transactions", authMiddleware, walletTransactionHistory);
router.post("/withdraw-funds", authMiddleware, withdrawFunds);
router.post("/send-otp", authMiddleware, recoverTransactionPin);
router.post("/verify-otp", verifyOTP);
router.patch("/change-transaction-pin", authMiddleware, changeTransactionPin);

module.exports = router;
