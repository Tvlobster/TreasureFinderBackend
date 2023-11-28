require('dotenv').config()
const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const clientRouters = require('./routers/clientRouter');
const sellerRouters = require('./routers/sellerRouter');
const session = require('express-session')
const MongoStore = require('connect-mongo')

 
//middle ware
const app = express()
//this starts the server and assignes its port
app.use(express.json())
const port = process.env.PORT
app.listen(port)

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




app.use(clientRouters);
app.use(sellerRouters);
