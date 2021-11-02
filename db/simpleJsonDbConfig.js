require("dotenv").config();
const JSONdb = require("simple-json-db");

const droneDb = () =>{
    return new JSONdb(process.env.DRONE_DB_FILEPATH);
}


module.exports = droneDb;