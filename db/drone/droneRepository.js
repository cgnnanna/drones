const { droneDb } = require("../simpleJsonDbConfig");

const db = droneDb();

const saveDrone = (drone) => {
    if (db.has(drone.serialNum)) {
        return false;
    }
    db.set(drone.serialNum, drone);
    return true;
}

const getDronesByProperty = (property, value) => {
    const items = db.JSON();
    const result = [];
    for (const item in items) {
        if (items[item][property] === value) {
            result.push(items[item]);
        }
    }
    return result;
}

const updateDrone = (drone) => {
    if (db.has(drone.serialNum)) {
        db.set(drone.serialNum, drone);
        return true;
    }
    return false;
}

const getDroneBySerialNum = (key) => {
    return db.get(key);
}

module.exports = {
    saveDrone,
    getDronesByProperty,
    getDroneBySerialNum,
    updateDrone
}