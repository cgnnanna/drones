require("dotenv").config();
const JSONdb = require("simple-json-db");

const droneDb = () =>{
    return new JSONdb(process.env.DRONE_DB_FILEPATH);
}
const medicationDb = () =>{
    return new JSONdb(process.env.MED_DB_FILEPATH);
}
const auditDb = () =>{
    return new JSONdb(process.env.AUDIT_DB_FILEPATH);
}


module.exports = {
    droneDb,
    medicationDb,
    auditDb
}