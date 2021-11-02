const express = require("express");
const router = express.Router();
const { registerDrone, getAvailableDrones } = require("../controller/droneController");
const droneValidation = require("../validation/droneValidation");

router.post("/register", droneValidation("registerDrone"), registerDrone);
router.get("/", getAvailableDrones);

module.exports = router;