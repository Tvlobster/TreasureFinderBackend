const express = require("express")
const User = require("../models/User")





const router = new express.Router()



router.post('/users/register',async (req,res)=>{
    let userFromBody = req.body;
    console.log("User Connected to /users/register")
try {
     const user = new User(userFromBody);
     let x = await user.save();
     x.password = "";
     res.send({user:x})
    
} catch (error){
    res.send({error:error})
}



});
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