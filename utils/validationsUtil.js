const { validationResult } = require("express-validator");
const httpStatus = require("./httpStatus");
const response = require ("./response");

const validation = (req, res) => {
    const errors = validationResult(req);
    if(errors && !errors.isEmpty()){
        return res.status(httpStatus.BAD_REQUEST).json(response(false, "An error occurred during validation, view the errors below", errors.array()))
    }
    return null;
};



module.exports = validation;