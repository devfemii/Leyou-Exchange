const express = require("express");
const { tradeGiftCard } = require("../controllers/transaction.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const imageValidatorMiddleware = require("../middleware/image.validation.middleware");

router.post(
  "/card/trade",
  authMiddleware,
  imageValidatorMiddleware.array("giftCardImages", 12),
  tradeGiftCard
);

module.exports = router;
