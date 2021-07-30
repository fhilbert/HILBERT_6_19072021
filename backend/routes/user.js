const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.userCheck, userCtrl.signup);
router.post("/login", userCtrl.userCheck, userCtrl.login);

module.exports = router;
