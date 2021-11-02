require("dotenv").config();
const JSONdb = require("simple-json-db");

const simpleDb = () =>{
    return new JSONdb(process.env.DB_FILEPATH);
}


module.exports = simpleDb;