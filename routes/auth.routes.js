const express = require("express");
const {
  register,
  createTransactionPin,
  sendCode,
  verifyCode,
  login,
  forgetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forget-password", forgetPassword);

router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);

router.get("/verified-mail-password-reset/:signature");
router.patch("/create/transaction-pin", createTransactionPin);

module.exports = router;
