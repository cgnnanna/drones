require("dotenv").config();
const express = require("express");
const droneRoute = require("./route/droneRoute");
const app = express();

app.use("/drone", droneRoute);

app.use((req, res)=>{
    res.status(404).json({
        message: "The route you are trying to access does not exist"
    });
});

const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`server running at port ${port}`);
  });