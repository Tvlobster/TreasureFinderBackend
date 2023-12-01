const express = require("express")
const User = require("../models/User")
const Item = require("../models/Item")
const GarageSale = require("../models/GarageSale")
const router = new express.Router()


router.get('/seller/allGarageSales',async (req,res)=>{
    console.log("User connected to /seller/allGarageSales")
    console.log(req.body)
    let GarageSales = await GarageSale.find({})
    res.send({listOfGarageSales:GarageSales})
})

router.post('/seller/newGarageSale',async (req,res)=>{
    let garageSaleFromBody = req.body;
    console.log(req.body)
    try {
        console.log("User connected to /seller/newSale")
       
        res.send({listOfGarageSales:GarageSales})
    } catch (error) {
        
    }

})

router.get('/items',async (req,res)=>{
    let Items = await Item.find({})
    res.send({listOfItems:Items})
})


module.exports = router;