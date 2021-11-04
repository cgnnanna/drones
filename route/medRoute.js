const express = require("express");
const router = express.Router();
const { loadMed, getLoadedMed } = require("../controller/medController");
const medValidation = require("../validation/medValidation");

router.post("/load/:serialNum", medValidation("loadMed"), loadMed);
router.get("/fetch/:serialNum", medValidation("getLoadedMed"), getLoadedMed);













module.exports = router;