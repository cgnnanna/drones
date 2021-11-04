const {medicationDb} = require("./simpleJsonDbConfig");

const medDb = medicationDb();

const saveMed = (medObj, serialNum) => {
    medDb.set(serialNum, medObj);
}

const getMedByDroneSerialNum = (serialNum) => {
    let medObj = medDb.get(serialNum);
    return medObj ? medObj : {meds:[], totalWeight:0};
}

const updateMed = (serialNum) => {
    let medObj = medDb.get(serialNum);
    if (medObj) {
        medDb.set(serialNum, medObj);
        return true;
    }
    return false;
}

const deleteLoadedMed = (serialNum) => {
    medDb.delete(serialNum);
} 


module.exports = {
    saveMed,
    getMedByDroneSerialNum, 
    updateMed,
    deleteLoadedMed
}





