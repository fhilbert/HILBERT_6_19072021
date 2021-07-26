const express = require("express");
const router = express.Router();

const stuffCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, stuffCtrl.createSauce);
router.post("/:id/like", auth, stuffCtrl.dealLike);

router.put("/:id", auth, multer, stuffCtrl.modifySauce);
router.get("/:id", auth, stuffCtrl.getOneSauce);
router.delete("/:id", auth, stuffCtrl.deleteSauce);
router.get("/", auth, stuffCtrl.getAllSauces);

module.exports = router;
