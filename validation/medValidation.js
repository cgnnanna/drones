const {check} = require("express-validator");

const medValidate = (type) => {
    switch (type) {
        case "loadMed": {
            return [
                check("name").custom(nameCheck),
                check("code").custom(codeCheck),
                check("weight").isFloat({min: 1}).withMessage("weight should be a valid number and should not be less than 1"),
                check("isLoaded").isBoolean().withMessage("isLoaded should be a valid boolean")
            ];
        }
    }

}

const nameCheck = (value) => {
    const regex = new RegExp("^([0-9]|[a-z]|[A-Z]|_|-)+$");
    if(!regex.test(value)){
        throw new Error("name should only contain alphanumeric characters, '-', and/or '_'");
    }
    return true;
}

const codeCheck = (value) => {
    const regex = new RegExp("^([0-9]|[A-Z]|_)+$");
    if(!regex.test(value)){
        throw new Error("code should be in Upper case and should only contain alphanumeric characters and/or '_'");
    }
    return true;
}

module.exports = medValidate;