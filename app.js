require("dotenv").config();
const express = require("express");
const droneRoute = require("./route/droneRoute");
const medRoute = require("./route/medRoute");
const auditRoute = require("./route/auditRoute");
const httpStatus = require("./utils/httpStatus");
const response = require("./utils/response");

const app = express();
app.use(express.json());
app.use("/static", express.static("public"));

app.use("/drone", droneRoute);
app.use("/med", medRoute);
app.use("/audit", auditRoute);

app.use((req, res)=>{
    res.status(httpStatus.NOT_FOUND).json(response(false, "The route you are trying to access does not exist"));
});

const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`server running at port ${port}`);
  });