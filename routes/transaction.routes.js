const express = require("express");
const {
  tradeGiftCard,
  transactionHistory,
  withdrawFunds,
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

router.post("/withdraw-funds", authMiddleware, withdrawFunds);

module.exports = router;
