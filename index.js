//Author-Nicklas Mortensen-Seguin
//Created 11/17/23
//Last Modified-12/8/23


//required Imports
require('dotenv').config()
const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const clientRouters = require('./routers/clientRouter');
const sellerRouters = require('./routers/sellerRouter');
const requestRouters = require('./routers/requestRouters');
const session = require('express-session')
const http = require('http')
const socket = require('./modules/socketIOSetup')
const MongoStore = require('connect-mongo')


 
//middle ware
const app = express()
app.use(express.json())


//creates the http server for the notifications.
const server = http.createServer(app);

//creates the websockets the allows users to connect to the server
socket.initialize(server);





const port = process.env.PORT
//app.listen(port)

//DB connection
const url = process.env.MONGO_URL
async function connect() {
    try {
        await mongoose.connect(url)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error(error)
    }
}


connect();

//session table in db
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: url
    })
}))




//server start
server.listen(process.env.PORT || 4000, () => {
    console.log(`Listening on port ${process.env.PORT || 4000}`);
});



//routers
app.use(clientRouters);
app.use(sellerRouters);
app.use(requestRouters);

