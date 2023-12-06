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
//this starts the server and assignes its port
app.use(express.json())


const server = http.createServer(app);

socket.initialize(server);





const port = process.env.PORT
//app.listen(port)

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

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: url
    })
}))





server.listen(process.env.PORT || 4000, () => {
    console.log(`Listening on port ${process.env.PORT || 4000}`);
});




app.use(clientRouters);
app.use(sellerRouters);
app.use(requestRouters);

