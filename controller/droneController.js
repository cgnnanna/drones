const validationsUtil = require("../utils/validationsUtil")
const httpStatus = require("../utils/httpStatus");
const response = require("../utils/response");


const registerDrone = (req, res) => {
    const validations = validationsUtil(req, res);
    if(validations){
        return validations;
    }
    const drone = {
        serialNum: req.body.serialNum,
        model: req.body.model,
        weight: req.body.weight,
        batteryLevel: req.body.batteryLevel,
        state: req.body.state
    }
        res.json(response(true, "validation was successful", req.body));
};


module.exports = registerDrone;