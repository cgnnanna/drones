const validationsUtil = require("../utils/validationsUtil")
const httpStatus = require("../utils/httpStatus");
const response = require("../utils/response");
const simpleJsonDb = require("../db/simpleJsonDb");
const droneState = require("../utils/state");

const db = simpleJsonDb();

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
    if(db.has(drone.serialNum)){
       return res.status(httpStatus.CONFLICT).json(response(false, "A drone already exists with this serial number"));
    }
    db.set(drone.serialNum, drone);
    return res.json(response(true, null, drone));
};

const getAvailableDrones = (req, res) => {
    const items = db.JSON();
    const result = [];
    for (const item in items){
        if (items[item].state === droneState.IDLE){
            result.push(items[item]);
        } 
    }
    return res.json(response(true, null, result));
}

module.exports = {
    registerDrone,
    getAvailableDrones
}