const express = require("express");
const router = express.Router();
const registerDrone = require("../controller/droneController");
const droneValidation = require("../validation/droneValidation");

router.post("/register", droneValidation("registerDrone"), registerDrone);

module.exports = router;