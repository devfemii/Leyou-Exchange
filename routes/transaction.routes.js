const express = require("express");
const {
  tradeGiftCard,
  transactionHistory,
  withdrawFunds,
  recoverTransactionPin,
  changeTransactionPin,
  walletTransactionHistory,
  verifyOTP,
  redeemedPoint,
} = require("../controllers/transaction.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const imageValidatorMiddleware = require("../middleware/image.validation.middleware");

router.post(
  "/card/trade",
  authMiddleware,
  imageValidatorMiddleware.array("giftCardImages", 12),
  tradeGiftCard,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/history", authMiddleware, transactionHistory);

router.get("/wallet-transactions", authMiddleware, walletTransactionHistory);
router.post("/withdraw-funds", authMiddleware, withdrawFunds);

router.post("/send-otp", authMiddleware, recoverTransactionPin);
router.post("/verify-otp", verifyOTP);

router.patch("/change-transaction-pin", authMiddleware, changeTransactionPin);

router.patch("/redeem-point", authMiddleware, redeemedPoint);

module.exports = router;
