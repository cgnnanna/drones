require("dotenv").config();
const express = require("express");
const droneRoute = require("./route/droneRoute");
const httpStatus = require("./utils/httpStatus");
const response = require("./utils/response");
//const simpleDb = require("./config/simpleJsonDb");

const app = express();
app.use(express.json());
app.use("/drone", droneRoute);

app.use((req, res)=>{
    res.status(httpStatus.NOT_FOUND).json(response(false, "The route you are trying to access does not exist"));
});

const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`server running at port ${port}`);
  });