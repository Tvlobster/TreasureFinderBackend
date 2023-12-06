const express = require("express")
const User = require("../models/User")
const Item = require("../models/Item")
const GarageSale = require("../models/GarageSale")
const socket = require('../modules/socketIOSetup');
const io = socket.getIo();

const router = new express.Router()


//finds all garageSales
router.get('/seller/allGarageSales',authenticateUser,async (req,res)=>{
    console.log("User connected to /seller/allGarageSales")
    console.log(req.body)
    let GarageSales = await GarageSale.find({}).populate('User').exec();

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

       notifyNewGarageSale({ title: 'New Garage Sale', description: 'Check out the new garage sale near you!' });


       res.send(save);
    } catch (error) {
        res.send(error);
    }

})
//deletes a garageSale
router.delete('/seller/deleteGarageSale/:id',authenticateUser,async(req,res)=>{
    try {
        console.log("User connected to /seller/deleteGarageSale");
        let garageSaleId = req.params.id;
        console.log(garageSaleId)
        let garageSale = await GarageSale.findById(garageSaleId);
        console.log(garageSale);
        if (!garageSale) {
            return res.send({ error: 'GarageSale not found' });
        }

        if (garageSale.owner.toString() !== req.session.user_id.toString()) {
            return res.send({ error: 'Not authorized to delete this garage sale' });
        }

        const deleteGarageSale = await GarageSale.findByIdAndDelete(req.params.id)
        res.send({deleteGarageSale});
    } catch (error) {
        res.send(error);
    }


})









router.post('/seller/newItem',authenticateUser,async (req,res)=>{
    let itemFromBody = req.body;
    console.log(req.body)
    try {
        console.log("User connected to /seller/newItem")
       let newItem = new Item(itemFromBody);
       newItem.owner = req.session.user_id;
       const save = await newItem.save()

       res.send(save);
    } catch (error) {
        res.send(error);
    }

})
















//gets all items
router.get('/items',authenticateUser,async (req,res)=>{
    let Items = await Item.find({})
    res.send({listOfItems:Items})
})







function notifydeleteRequest(requestInfo,user_id){
    io.emit('deleteRequest_'+user_id,requestInfo)
    console.log("New Request Sent for user " + user_id)
}




function notifyNewGarageSale(garageSaleInfo) {

    io.emit('newGarageSale', garageSaleInfo);
    console.log("Send new garage sale")
}



module.exports = router;