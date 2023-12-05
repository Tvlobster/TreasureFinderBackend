require('dotenv').config()
const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const clientRouters = require('./routers/clientRouter');
const sellerRouters = require('./routers/sellerRouter');
const session = require('express-session')
const http = require('http')
const socketIo = require('socket.io')
const MongoStore = require('connect-mongo')


 
//middle ware
const app = express()
//this starts the server and assignes its port
app.use(express.json())


const server = http.createServer(app);
const io = socketIo(server);



io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});







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




module.exports.io = io;
