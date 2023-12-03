const express = require("express")
const User = require("../models/User")
const Item = require("../models/Item")
const GarageSale = require("../models/GarageSale")
const router = new express.Router()

//finds all garageSales
router.get('/seller/allGarageSales',authenticateUser,async (req,res)=>{
    console.log("User connected to /seller/allGarageSales")
    console.log(req.body)
    let GarageSales = await GarageSale.find({})
    res.send({listOfGarageSales:GarageSales})
})

//adds a new Garage Sale
router.post('/seller/newGarageSale',authenticateUser,async (req,res)=>{
    let garageSaleFromBody = req.body;
    console.log(req.body)
    try {
        console.log("User connected to /seller/newGarageSale")
       let newGarageSale = new GarageSale(garageSaleFromBody);
       newGarageSale.owner = req.session.user_id;

       const save = await newGarageSale.save()
       res.send(save);




        res.send({listOfGarageSales:GarageSales})
    } catch (error) {
        res.send(error);
    }

})
//deletes a garageSale
router.delete('/seller/deleteGarageSale',authenticateUser,async(req,res)=>{
    try {
        console.log("User connected to /seller/deleteGarageSale");
        const garageSaleId = req.body.id;
        const garageSale = await GarageSale.findById(garageSaleId);

        if (!garageSale) {
            return res.send({ error: 'GarageSale not found' });
        }

        if (garageSale.owner.toString() !== req.session.user_id.toString()) {
            return res.send({ error: 'Not authorized to delete this garage sale' });
        }

        await garageSale.remove();
        res.send({ message: 'GarageSale deleted successfully' });
    } catch (error) {
        res.send(error);
    }


})

















//gets all items
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