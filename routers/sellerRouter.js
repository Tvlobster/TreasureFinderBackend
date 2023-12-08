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
        //creates the garageSale and sets the owner
        console.log("User connected to /seller/newGarageSale")
       let newGarageSale = new GarageSale(garageSaleFromBody);
       newGarageSale.owner = req.session.user_id;
       const save = await newGarageSale.save()

       //notifies all users that a new Garage Sale has opened.
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
        //checks to see if the garageSale exists
        if (!garageSale) {
            return res.send({ error: 'GarageSale not found' });
        }

        //checks to see if they own the garageSale
        if (garageSale.owner.toString() !== req.session.user_id.toString()) {
            return res.send({ error: 'Not authorized to delete this garage sale' });
        }


        //deletes all the items that are connected to each garageSale 
        for (let i = 0; i < garageSale.items.length; i++) {
           let deletedItem = await Item.findByIdAndDelete(garageSale.items[i]);
           notifydeleteRequest({ title: 'Requested Item has been deleted', description: 'One of your requested items has been deleted' },deletedItem.request)
        }


        //deletes the GarageSale.
        const deleteGarageSale = await GarageSale.findByIdAndDelete(req.params.id)
        res.send({deleteGarageSale});
    } catch (error) {
        res.send(error);
    }


})








//creates a new Item in the db
//and adds that item into the garageSale it is associated with
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



//deletes the Item from the db
router.delete('/seller/deleteItem/:id',authenticateUser,async (req,res)=>{
    try {
        console.log("User connected to /seller/deleteItem")

        //deletes the item from the db
        let deleteItem = await Item.findByIdAndDelete(req.params.id);

        //we now need to delete the item from the List of items on each garageSale
        let garageSale = await GarageSale.findById(deleteItem.saleId)

        //sends a notification to the user that requested the app
        notifydeleteRequest({ title: 'Requested Item has been deleted', description: 'One of your requested items has been deleted' },deleteItem.request)
        console.log(garageSale)

        //removes the item from the array of items and saves the garageSale
        const index = garageSale.items.indexOf(req.params.id)
        if (index > -1){
            garageSale.items.splice(index);
        }
        const save = await garageSale.save();
        console.log(save)

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

//authenticates a user is signed in
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



//This function will send a notification to a user if an 
//item they requested was deleted off of the garageSale
function notifydeleteRequest(requestInfo,user_id){
    const io = socket.getIo();
    io.emit('deleteRequest_'+user_id,requestInfo)
    console.log("deleteRequest_" + user_id)
}



//This will notify all users of the app that a newGarageSale has opened.
function notifyNewGarageSale(garageSaleInfo) {
    const io = socket.getIo();
    io.emit('newGarageSale', garageSaleInfo);
    console.log("Send new garage sale")
}



module.exports = router;