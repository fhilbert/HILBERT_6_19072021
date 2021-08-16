const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, sauceCtrl.sauceCheck, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.dealLike);

router.put("/:id", auth, multer, sauceCtrl.sauceCheck, sauceCtrl.modifySauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.delete("/:id", auth, sauceCtrl.sauceCheck, sauceCtrl.deleteSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

module.exports = router;
