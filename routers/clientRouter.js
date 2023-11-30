const express = require("express")
const User = require("../models/User")
const bcrypt = require('bcrypt')





const router = new express.Router()



router.post('/users/register',async (req,res)=>{
    let userFromBody = req.body;
    console.log("User Connected to /users/register")
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
    let username = req.body.username
    let password = req.body.password

    const user = await User.findOne({username:username})
    if(!user){
        res.send("Incorrect Username or Password")
    } else {
        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            res.send({id:user.id})
        } else {
            res.send("Error logging in. Incorrect Username or password")
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
router.delete('/users')






//gets a users own items
router.get('/user/items',(req,res)=>{






})

//gets all
router.get('/treasure',(req,res)=>{






})

module.exports = router;