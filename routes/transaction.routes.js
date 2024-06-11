const express = require("express");
const {
  tradeGiftCard,
  transactionHistory,
} = require("../controllers/transaction.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const imageValidatorMiddleware = require("../middleware/image.validation.middleware");

const { sendErrorMessage } = require("../utils");

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

module.exports = router;
