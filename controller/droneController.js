const validationsUtil = require("../utils/validationsUtil");
const httpStatus = require("../utils/httpStatus");
const response = require("../utils/response");
const { saveDrone, getDronesByProperty, getDroneBySerialNum, updateDrone } = require("../db/droneRepository");
const { processTimeout } = require("./medController")
const droneState = require("../utils/state");

const registerDrone = (req, res) => {
    const validations = validationsUtil(req, res);
    if (validations) {
        return validations;
    }
    const drone = {
        serialNum: req.body.serialNum,
        model: req.body.model,
        batteryLevel: Math.floor(req.body.batteryLevel),
        state: droneState.IDLE
    }
    switch (drone.model.toUpperCase()) {
        case "LIGHTWEIGHT": {
            drone.weight = 100;
            break;
        }
        case "MIDDLEWEIGHT": {
            drone.weight = 200;
            break;
        }
        case "CRUISERWEIGHT": {
            drone.weight = 350;
            break;
        }
        case "HEAVYWEIGHT": {
            drone.weight = 500;
            break;
        }
    }
    if (!saveDrone(drone)) {
        return res.status(httpStatus.CONFLICT).json(response(false, "A drone already exists with this serial number"));
    }
    return res.json(response(true, null, drone));
};

const getAvailableDrones = (req, res) => {
    let result = getDronesByProperty("state", droneState.IDLE);
    return res.json(response(true, null, result));
}

const getDroneBatteryLevel = (req, res) => {
    const validations = validationsUtil(req, res);
    if (validations) {
        return validations;
    }
    let result = getDroneBySerialNum(req.params.serialNum);
    if (!result) {
        return res.status(httpStatus.NOT_FOUND).json(response(false, "No drone exists with the serialNum "));
    }
    return res.json(response(true, null, { batteryLevel: result.batteryLevel }));
}

const returnDrone = (req, res) => {
    const validations = validationsUtil(req, res);
    if (validations) {
        return validations;
    }
    let drone = getDroneBySerialNum(req.params.serialNum);
    if (!drone) {
        return res.status(httpStatus.NOT_FOUND).json(response(false, "No drone exists with the serialNum "));
    }
    if (drone.state !== droneState.DELIVERED) {
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "Drone has not yet delivered any medication"))
    }
    state = droneState.RETURNING;
    updateDrone(drone);
    console.log("Drone is returning");
    setTimeout(processTimeout, process.env.DELIVERY_TIME_SECS, droneState.IDLE, drone)
    return res.json(response(true, "Drone has started returning"));
}

module.exports = {
    registerDrone,
    getAvailableDrones,
    getDroneBatteryLevel,
    returnDrone
}