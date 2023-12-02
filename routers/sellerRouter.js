const express = require("express")
const User = require("../models/User")
const Item = require("../models/Item")
const GarageSale = require("../models/GarageSale")
const router = new express.Router()


router.get('/seller/allGarageSales',authenticateUser,async (req,res)=>{
    console.log("User connected to /seller/allGarageSales")
    console.log(req.body)
    let GarageSales = await GarageSale.find({})
    res.send({listOfGarageSales:GarageSales})
})

router.post('/seller/newGarageSale',authenticateUser,async (req,res)=>{
    let garageSaleFromBody = req.body;
    console.log(req.body)
    try {
        console.log("User connected to /seller/newSale")
       
        res.send({listOfGarageSales:GarageSales})
    } catch (error) {
        
    }

})

router.get('/items',authenticateUser,async (req,res)=>{
    let Items = await Item.find({})
    res.send({listOfItems:Items})
})



async function authenticateUser(req,res,next){
    console.log(req.session)
    if(!req.session.user_id){
        console.log("Unauthorized user")
        return res.send({error:"Unauthorized user"})
    }
    else{
        try {
            const user = await User.findById(req.session.user_id)
            req.user = user
            next()
        }
        catch(e){
            res.send(e)
        }
        
    }
}

module.exports = router;