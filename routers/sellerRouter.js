const express = require("express")
const User = require("../models/User")
const Item = require("../models/Item")
const GarageSale = require("../models/GarageSale")
const router = new express.Router()


router.get('/treasure/allProducts',async (req,res)=>{
    console.log("User connected to /treasure/allProducts")
    let GarageSales = await GarageSale.find({})
    res.send({listOfGarageSales:GarageSales})
})





module.exports = router;