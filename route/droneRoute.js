const express = require("express");
const router = express.Router();
const { registerDrone, getAvailableDrones, getDroneBatteryLevel, deliverLoadedMed,  returnDrone, chargeDrone} = require("../controller/droneController");
const droneValidation = require("../validation/droneValidation");

router.post("/register", droneValidation("registerDrone"), registerDrone);
router.get("/", getAvailableDrones);
router.get("/batteryLevel/:serialNum", droneValidation("getDroneBatteryLevel"), getDroneBatteryLevel);
router.post("/deliver/:serialNum", droneValidation("deliverLoadedMed"), deliverLoadedMed);
router.get("/return/:serialNum", droneValidation("returnDrone"), returnDrone);
router.post("/charge", droneValidation("chargeDrone"), chargeDrone);

module.exports = router;