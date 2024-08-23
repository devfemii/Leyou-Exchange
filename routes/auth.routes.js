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

//<--------- refactored routes start here --------->
router.post("/register", register);
router.post("/login", login);
//<--------- refactored routes end here --------->
router.post("/password/forget", forgetPassword);
router.get("/verify-mail-password-reset/:signature", verifiedEmailPasswordReset);
router.post("/password/reset", updatePassword);
router.post("/change-pin", changePin);

router.post("/code/send", sendCode);
router.post("/code/verify", verifyCode);

router.patch("/create/transaction-pin", createTransactionPin);

module.exports = router;
