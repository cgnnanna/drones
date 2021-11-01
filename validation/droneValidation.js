const {check} = require("express-validator");

const validate = (type) => {
    switch (type) {
        case "registerDrone": {
            return [
                check("serialNum").isString().withMessage("serialNum should be an array of characters")
                .notEmpty().withMessage("serialNum should not be empty")
                .isLength({ max: 100 }).withMessage("serialNum length should not be greater than 100 characters"),
                check("model").isString().withMessage("model should be an array of character"),
                check("weight").isNumeric().withMessage("weight should be a number"),
                check("batteryLevel").isNumeric().withMessage("batteryLevel should be a number"),
                check("state").isString().withMessage("state should be an array of characters")
            ];
        }
    }

}

module.exports = validate;