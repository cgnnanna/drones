const express = require("express");
const router = express.Router();
const { loadMed, getLoadedMed } = require("../controller/medController");
const medValidation = require("../validation/medValidation");
const upload = require("../config/multer");

router.post("/load/:serialNum", upload.single("image"), medValidation("loadMed"),  loadMed);
router.get("/fetch/:serialNum", medValidation("getLoadedMed"), getLoadedMed);













module.exports = router;