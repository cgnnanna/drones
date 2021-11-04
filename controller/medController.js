const validationsUtil = require("../utils/validationsUtil")
const httpStatus = require("../utils/httpStatus");
const response = require("../utils/response");
const droneState = require("../utils/state");
const { getDroneBySerialNum, updateDrone } = require("../db/droneRepository");
const { saveMed, getMedByDroneSerialNum, updateMed, deleteLoadedMed } = require("../db/medRespository");



const loadMed = (req, res) => {
    const validations = validationsUtil(req, res);
    if (validations) {
        return validations;
    }
    const med = {
        name: req.body.name,
        weight: Math.floor(req.body.weight),
        code: req.body.code,
        image: req.body.image
    }
    let drone = getDroneBySerialNum(req.params.serialNum);
    if (drone.batteryLevel < 25) {
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "drone's battery level is lower than 25%, please charge drone before you can use it."));
    }
    if (drone.state.toUpperCase() !== droneState.IDLE && drone.state.toUpperCase() !== droneState.LOADING) {
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "drone is not available to load medication"));
    }
    let medObj = getMedByDroneSerialNum(drone.serialNum);
    let totalWeight = medObj.totalWeight + med.weight;
    if (totalWeight > drone.weight) {
        return res.status(httpStatus.BAD_REQUEST).json(response(false, `the drone can only take medication of weight ${drone.weight - medObj.totalWeight}`));
    }
    medObj.meds.push(med);
    medObj.totalWeight = totalWeight;
    if (drone.state === droneState.IDLE) {
        drone.state = droneState.LOADING;
    }
    if (drone.weight === totalWeight || req.body.isLoaded) {
        console.log(totalWeight);
        drone.state = droneState.LOADED;
    }
    if (updateDrone(drone)) {
        saveMed(medObj, drone.serialNum);
        return res.json(response(true, null, med));
    }
    return res.status(httpStatus.BAD_REQUEST).json(response(false, "There was an error in loading your medication, please try again later."));
}

const getLoadedMed = (req, res) => {
    let drone = getDroneBySerialNum(req.params.serialNum);
    if (!drone) {
        return res.status(httpStatus.NOT_FOUND).json(response(false, "No drone exists with this serialNum"))
    }
    let loadedMed = getMedByDroneSerialNum(req.params.serialNum);
    return res.json(response(true, null, loadedMed.meds));
}

const deliverLoadedMed = (req, res) => {
    let drone = getDroneBySerialNum(req.params.serialNum);
    if (!drone) {
        return res.status(httpStatus.NOT_FOUND).json(response(false, "No drone exists with this serialNum"));
    }
    let loadedMed = getMedByDroneSerialNum(drone.serialNum);
    if (drone.state !== droneState.LOADED) {
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "drone cannot start delivery"))
    }
    drone.state = droneState.DELIVERING;
    loadedMed.deliveryAddress = req.body.deliveryAddress;
    updateMed(drone.serialNum);
    updateDrone(drone);
    //Simulate delivery time
    setTimeout(processTimeout, process.env.DELIVERY_TIME_SECS * 1000, droneState.DELIVERED, drone);
    return res.json(response(true, "the drone has started the delivery"));
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
    loadMed,
    getLoadedMed,
    deliverLoadedMed,
    processTimeout
}