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
  changePasswordFromProfile,
} = require("../controllers/auth.controller");

const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.post("/password/forget", forgetPassword);
router.get(
  "/verify-mail-password-reset/:signature",
  verifiedEmailPasswordReset
);
router.post("/password/reset", updatePassword);

router.post("/code/send", sendCode);
router.post("/code/verify", verifyCode);

router.patch("/create/transaction-pin", createTransactionPin);

router.patch("/change-password", authMiddleware, changePasswordFromProfile);

module.exports = router;
