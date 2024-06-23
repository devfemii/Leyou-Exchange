const express = require("express");
const {
  register,
  createTransactionPin,
  sendCode,
  verifyCode,
  login,
  forgetPassword,
  verifiedEmailPasswordReset,
  updatePassword,
  changePin,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/password/forget", forgetPassword);
router.get(
  "/verify-mail-password-reset/:signature",
  verifiedEmailPasswordReset
);
router.post("/password/reset", updatePassword);
router.post("/change-pin", changePin);

router.post("/code/send", sendCode);
router.post("/code/verify", verifyCode);

router.post("/create/transaction-pin", createTransactionPin);

module.exports = router;
