const validationsUtil = require("../utils/validationsUtil")
const httpStatus = require("../utils/httpStatus");
const response = require("../utils/response");
const {saveDrone, getDronesByProperty} = require("../db/droneRepository");
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
    switch(drone.model.toUpperCase()){
        case "LIGHTWEIGHT" : {
            drone.weight = 100;
            break;
        }
        case "MIDDLEWEIGHT" : {
            drone.weight = 200;
            break;
        }
        case "CRUISERWEIGHT" : {
            drone.weight = 350;
            break;
        }
        case "HEAVYWEIGHT" : {
            drone.weight = 500;
            break;
        }
    }
    if(!saveDrone(drone)){
       return res.status(httpStatus.CONFLICT).json(response(false, "A drone already exists with this serial number"));
    }
    return res.json(response(true, null, drone));
};

const getAvailableDrones = (req, res) => {
    let result = getDronesByProperty("state", droneState.IDLE);
    return res.json(response(true, null, result));
}

const getDroneBatteryLevel = (req, res) => {

}

module.exports = {
    registerDrone,
    getAvailableDrones,
    getDroneBatteryLevel
}