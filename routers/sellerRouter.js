const express = require("express")
const User = require("../models/User")
const Item = require("../models/Item")
const GarageSale = require("../models/GarageSale")
const socket = require('../modules/socketIOSetup');

const router = new express.Router()


//finds all garageSales
router.get('/seller/allGarageSales',authenticateUser ,async (req,res)=>{
    console.log("User connected to /seller/allGarageSales")
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


        for (let i = 0; i < garageSale.items.length; i++) {
            await Item.findByIdAndDelete(garageSale.items[i]);
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
       let editGarage = await GarageSale.findById(itemFromBody.saleId)
       editGarage.items.push(newItem.id)
       
       const saveGarage = await editGarage.save();
       newItem.owner = req.session.user_id;
       const save = await newItem.save()

       res.send(save);
    } catch (error) {
        res.send(error);
    }

})




router.delete('/seller/deleteItem/:id',authenticateUser,async (req,res)=>{
    try {
        console.log("User connected to /seller/deleteItem")

        let deleteItem = await Item.findByIdAndDelete(req.params.id);

        let garageSale = await GarageSale.findById(deleteItem.saleId)

        notifydeleteRequest({ title: 'New Request Item', description: 'Someone Requested one of the items in your sale!' },item.request)
        console.log(garageSale)
        const index = garageSale.items.indexOf(deleteItem.id)
        if (index > -1){
            garageSale.items.splice(index);
        }
        const save = await garageSale.save();



        res.send(deleteItem);
    } catch (error) {
        res.send(error)
    }



});












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




function notifydeleteRequest(requestInfo,user_id){
    const io = socket.getIo();
    io.emit('deleteRequest_'+user_id,requestInfo)
    console.log("New Request Sent for user " + user_id)
}




function notifyNewGarageSale(garageSaleInfo) {
    const io = socket.getIo();
    io.emit('newGarageSale', garageSaleInfo);
    console.log("Send new garage sale")
}



module.exports = router;