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
router.post('/login',async (req,res)=>{

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
            req.session.user_id = user._id;
            res.send({id:user.id})
        } else {
            res.send("ERROR")
        }
    
    }



})
router.get('/users',authenticateUser,async (req,res)=>{

    try{
        let users = await User.find({}).exec();
        res.send({users:users})
    
    }catch(error){

    }
})

//gets a users own items
router.get('/user/items',(req,res)=>{






})



//makes sure the user is logged in
async function authenticateUser(req,res,next){
    console.log(req.session)
    if(!req.session.user_id){
        console.log("Unauthorized user")
        return res.send('You are not logged in')
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