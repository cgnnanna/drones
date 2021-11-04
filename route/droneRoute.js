const express = require("express");
const router = express.Router();
const { registerDrone, getAvailableDrones, getDroneBatteryLevel, returnDrone} = require("../controller/droneController");
const droneValidation = require("../validation/droneValidation");

router.post("/register", droneValidation("registerDrone"), registerDrone);
router.get("/", getAvailableDrones);
router.get("/batteryLevel/:serialNum", droneValidation("getDroneBatteryLevel"), getDroneBatteryLevel);
router.get("/return/:serialNum", droneValidation("returnDrone"), returnDrone);

module.exports = router;