const express = require("express");
const router = express.Router();
const registerDrone = require("../controller/droneController");

router.post("/register", registerDrone);

module.exports = router;