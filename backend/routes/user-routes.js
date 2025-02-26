const express = require("express");
const { registerUser, initiateLogin, verifyOTP } = require("../controllers/user-ctrl");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login/initiate", initiateLogin);
router.post("/login/verify", verifyOTP);

module.exports = router;