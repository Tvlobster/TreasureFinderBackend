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
const port = process.env.PORT
app.listen(port)

const url = process.env.MONGO_URL
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}, (err) => {
    if (err) 
        console.log("Error establishing MongoDB connection!")
    else 
        console.log("Connected to DB")
})






app.use(clientRouters);
app.use(sellerRouters);
