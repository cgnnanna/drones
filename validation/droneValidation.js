const {check} = require("express-validator");

const validate = (type) => {
    switch (type) {
        case "registerDrone": {
            return [
                check("serialNum").notEmpty().withMessage("serialNum should not be empty")
                .isAlphanumeric().withMessage("serialNum should be alphanumeric")
                .isLength({ max: 100 }).withMessage("serialNum length should not be greater than 100 characters"),
                check("model").custom(modelCheck),
                check("batteryLevel").isFloat({min: 0, max: 100}).withMessage("batteryLevel should be a number between 0 and 100"),
            ];
        }
    }

}
const modelCheck = (value) =>{
    value = value.toUpperCase();
    if(value !== "LIGHTWEIGHT" && value !== "MIDDLEWEIGHT" && value !== "CRUISERWEIGHT" && value !== "HEAVYWEIGHT"){
        throw new Error("model should be Lightweight, Middleweight, Cruiserweight, or Heavyweight");
    }
    return true;
}

module.exports = validate;