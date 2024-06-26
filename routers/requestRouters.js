const express = require("express")
const User = require("../models/User")
const Items = require("../models/Item")
const GarageSale = require("../models/GarageSale")
const bcrypt = require('bcrypt')
const Item = require("../models/Item")
const socket = require('../modules/socketIOSetup');


const router = new express.Router()


router.post('/request/new/:id',authenticateUser,async (req,res)=>{
try {
    let item = await Item.findById(req.params.id);
    console.log(item.request)
    if (item.request != "" && item.request != undefined && item.request != null){
        return res.send({Error:"Someone has already requested this item"});
    }

   item.request = req.session.user_id;
   

   notifyNewRequest({ title: 'New Request Item', description: 'Someone Requested one of the items in your sale!' },item.owner)
    const save = await item.save();

    res.send({request:save})


} catch (error) {
    res.send({error:error})
 }
});



router.get('/Not',authenticateUser,async (req,res)=>{
    notifyNewRequest({ title: 'New Request Item', description: 'Someone Requested one of the items in your sale!' },"656a5f55e665274c505b36a1")
    console.log("Sent Notifcation")
    res.send("Notification Sent")
})







function notifyNewRequest(requestInfo,user_id){
    const io = socket.getIo();
    console.log("newItemRequest_"+user_id)
    io.emit("newItemRequest_"+user_id,requestInfo)
    console.log("New Request Sent for user " + user_id)
}





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