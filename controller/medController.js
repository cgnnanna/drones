const validationsUtil = require("../utils/validationsUtil")
const httpStatus = require("../utils/httpStatus");
const response = require("../utils/response");
const droneState = require("../utils/state");
const { getDroneBySerialNum, updateDrone } = require("../db/drone/droneRepository");
const { saveMed, getMedByDroneSerialNum } = require("../db/med/medRespository");
const fs = require('fs')



const loadMed = (req, res) => {
    const validations = validationsUtil(req, res);
    if (validations) {
        return validations;
    }
    const med = {
        name: req.body.name,
        weight: Math.floor(req.body.weight),
        code: req.body.code,
        image: `${req.get("host")}/static/uploads/${req.file.filename}`
    }
    const path = `.${process.env.PUBLIC_PATH}${req.file.filename}`;
    let drone = getDroneBySerialNum(req.params.serialNum);
    if (!drone) {
        removeFile(path);
        return res.status(httpStatus.NOT_FOUND).json(response(false, "No drone exists with the serialNum "));
    }
    if (drone.batteryLevel < 25) {
        removeFile(path);
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "drone's battery level is lower than 25%, please charge drone before you can use it."));
    }
    if (drone.state.toUpperCase() !== droneState.IDLE && drone.state.toUpperCase() !== droneState.LOADING) {
        removeFile(path);
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "drone is not available to load medication"));
    }
    let medObj = getMedByDroneSerialNum(drone.serialNum);
    let totalWeight = medObj.totalWeight + med.weight;
    if (totalWeight > drone.weight) {
        removeFile(path);
        return res.status(httpStatus.BAD_REQUEST).json(response(false, `the drone can only take medication of weight ${drone.weight - medObj.totalWeight}`));
    }
    medObj.meds.push(med);
    medObj.totalWeight = totalWeight;
    if (drone.state === droneState.IDLE) {
        drone.state = droneState.LOADING;
    }
    if (drone.weight === totalWeight || req.body.isLoaded == "true") {
        drone.state = droneState.LOADED;
    }
    if (updateDrone(drone)) {
        saveMed(medObj, drone.serialNum);
        return res.json(response(true, null, med));
    }
    removeFile(path);
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

const removeFile = (path) => {
    try {
        fs.unlinkSync(path);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    loadMed,
    getLoadedMed
}