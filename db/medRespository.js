const {medicationDb} = require("./simpleJsonDbConfig");

const medDb = medicationDb();

const saveMed = (medObj, serialNum) => {
    medDb.set(serialNum, medObj);
}

const getMedByDroneSerialNum = (serialNum) => {
    let medObj = medDb.get(serialNum);
    return medObj ? medObj : {meds:[], totalWeight:0};
}

module.exports = {
    saveMed,
    getMedByDroneSerialNum
}





