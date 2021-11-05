const validationsUtil = require("../utils/validationsUtil");
const httpStatus = require("../utils/httpStatus");
const response = require("../utils/response");
const { saveDrone, getDronesByProperty, getDroneBySerialNum, updateDrone } = require("../db/drone/droneRepository");
const { getMedByDroneSerialNum, deleteLoadedMed, updateMed} = require("../db/med/medRespository");
const droneState = require("../utils/state");
const { saveAudit } = require("../db/audit/auditRepository");

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

const deliverLoadedMed = (req, res) => {
    let drone = getDroneBySerialNum(req.params.serialNum);
    if (!drone) {
        return res.status(httpStatus.NOT_FOUND).json(response(false, "No drone exists with this serialNum"));
    }
    if (drone.state !== droneState.LOADED) {
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "drone cannot start delivery"))
    }
    drone.state = droneState.DELIVERING;
    let loadedMed = getMedByDroneSerialNum(drone.serialNum);
    loadedMed.deliveryAddress = req.body.deliveryAddress;
    updateMed(drone.serialNum);
    updateDrone(drone);
    //Simulate delivery time
    setTimeout(processTimeout, process.env.DELIVERY_TIME_SECS * 1000, droneState.DELIVERED, drone);
    dischargeBattery(drone, loadedMed.totalWeight);
    return res.json(response(true, "Drone has started the delivery"));
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
    setTimeout(processTimeout, process.env.DELIVERY_TIME_SECS * 1000, droneState.IDLE, drone);
    dischargeBattery(drone);
    return res.json(response(true, "Drone has started returning"));
}

const chargeDrone = (req, res) => {
    const validations = validationsUtil(req, res);
    if(validations){
        return validations;
    }
    let drone = getDroneBySerialNum(req.body.serialNum);
    if (!drone) {
        return res.status(httpStatus.NOT_FOUND).json(response(false, "No drone exists with the serialNum "));
    }
    if(drone.batteryLevel === 100){
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "Drone's battery is full"))
    }
    let tempBatteryLevel = drone.batteryLevel;
    drone.batteryLevel = drone.batteryLevel + Math.floor(req.body.batteryInput);
    drone.batteryLevel = drone.batteryLevel > 100 ? 100 : drone.batteryLevel;
    const change = drone.batteryLevel - tempBatteryLevel;
    updateDrone(drone);
    saveAudit("batteryLevel", createBatteryAudit(drone, change, "CHARGE"));
    return res.json(response(true, "Drone has been charged"));
}



const dischargeBattery = (drone, totalWeight=0) =>{
    //0.001 is an assumed discharge factor
    const change = (0.001 * (drone.weight + totalWeight) * process.env.DELIVERY_TIME_SECS);
    drone.batteryLevel = Math.floor(drone.batteryLevel - change);    
    updateDrone(drone);
    saveAudit("batteryLevel", createBatteryAudit(drone, change, "DISCHARGE"))
}

const createBatteryAudit = (drone, change, type) =>{
    return {
        serialNum: drone.serialNum,
        dateTime: new Date(),
        batteryLevel: drone.batteryLevel,
        percentageChange: change,
        auditType: type
    };
}

const processTimeout = (state, drone) => {
    drone.state = state;
    updateDrone(drone);
    if(state === droneState.DELIVERED){
        deleteLoadedMed(drone.serialNum);
        console.log("Loaded items have been delivered"); 
    }else if(state === droneState.IDLE){
        console.log("Drone has returned");
    }  
}

module.exports = {
    registerDrone,
    getAvailableDrones,
    getDroneBatteryLevel,
    deliverLoadedMed,
    returnDrone,
    chargeDrone
}