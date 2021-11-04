const express = require("express");
const router = express.Router();
const { loadMed, getLoadedMed, deliverLoadedMed } = require("../controller/medController");
const medValidation = require("../validation/medValidation");

router.post("/load/:serialNum", medValidation("loadMed"), loadMed);
router.get("/load/:serialNum", medValidation("getLoadedMed"), getLoadedMed);
router.post("/deliver/:serialNum", medValidation("deliverLoadedMed"), deliverLoadedMed);












module.exports = router;