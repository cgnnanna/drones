const express = require("express");
const router = express.Router();
const { loadMed } = require("../controller/medController");
const medValidation = require("../validation/medValidation");

router.post("/load/:serialNum", medValidation("loadMed"), loadMed);












module.exports = router;