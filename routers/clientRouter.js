const express = require("express")
const User = require("../models/User")
const bcrypt = require('bcrypt')





const router = new express.Router()



router.post('/users/register',async (req,res)=>{
    let userFromBody = req.body;
    console.log("User Connected to /users/register")
    console.log(req.body)
try {
    userFromBody.password = await bcrypt.hash(userFromBody.password,8);
     const user = new User(userFromBody);
     let x = await user.save();
     x.password = "";
     res.send({user:x})
} catch (error){
    res.send({error:error})
}


})
router.get('/login',async (req,res)=>{

    console.log("User Connected to /login")
    console.log(req.body)
    let username = req.body.username
    let password = req.body.password

    const user = await User.findOne({username:username})
    if(!user){
        res.send("ERROR")
    } else {
        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            res.send({id:user.id})
        } else {
            res.send("ERROR")
        }
    
    }



})
router.get('/users',async (req,res)=>{

    try{
        let users = await User.find({}).exec();
        res.send({users:users})
    
    }catch(error){

    }
})

//gets a users own items
router.get('/user/items',(req,res)=>{






})


module.exports = router;