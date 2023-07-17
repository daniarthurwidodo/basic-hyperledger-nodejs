require("dotenv").config() // load .env variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require("morgan") //import morgan
const {log} = require("mercedlogger") // import mercedlogger's log function
const UserRouter = require("./user/user.controller.js") 
const MonitorRouter = require("./monitoring/monitor.controller.js") 

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
const {PORT = 3000} = process.env

// Create Application Object
const app = express()

// GLOBAL MIDDLEWARE
app.use(cors()) // add cors headers
app.use(morgan("tiny")) // log the request for debugging
app.use(express.json()) // parse json bodies

// ROUTES AND ROUTES
app.get("/", (req, res) => {
    res.send("this is the test route to make sure server is working")
})

app.use("/user", UserRouter)
app.use("/monitor", MonitorRouter)


// db connection
const { DATABASE_URL } = process.env 
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error',() => log.red("ERROR CONNECTION", 'connection error:'));
db.once('open', () => log.green("DATABASE STATUS", `Connected to mongo `));

// APP LISTENER
app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`))