require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.SERVER_PORT


app.listen(port, () => {
    console.log(`server running at port ${port}`)
  })