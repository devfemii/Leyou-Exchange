const express = require("express");
const {} = require("../controllers/admin.controller");

const router = express.Router();

router.post("/giftcard", register);

module.exports = router;
