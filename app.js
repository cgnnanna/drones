require("dotenv").config();
const express = require("express");
const droneRoute = require("./route/droneRoute");
const app = express();

app.use("/drone", droneRoute);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`server running at port ${port}`);
  });