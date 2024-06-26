const express = require("express")
const User = require("../models/User")
const Items = require("../models/Item")
const GarageSale = require("../models/GarageSale")
const bcrypt = require('bcrypt')
const Item = require("../models/Item")





const router = new express.Router()


//Registers a new user account to the db
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
//Logs a user into the app
//finds the user in the db and checks to see if the password they entered is correct.
router.post('/login',async (req,res)=>{

    console.log("User Connected to /login")
    console.log(req.body)
    let username = req.body.username
    let password = req.body.password
    const user = await User.findOne({username:username})
    if(!user){
        res.send({error:"error"})
    } else {
        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            req.session.user_id = user._id;
            res.send({id:user.id})
        } else {
            res.send({error:"error"})
        }
    
    }



})
//pulls all users from the db.
router.get('/users',authenticateUser,async (req,res)=>{

    try{
        let users = await User.find({}).exec();
        res.send({users:users})
    
    }catch(error){

    }
})

//gets a users own items
router.get('/user/items',authenticateUser,async (req,res)=>{
try{
    console.log("User Connected to /user/items")

    let users = await User.findById(req.session.user_id).populate('Item').exec()

    console.log(users);
    res.send({users});

}catch(error){
    res.send({error})
}

});



//get a users own garageSales
router.get('/user/garageSales',authenticateUser,async (req,res)=>{
try{

    console.log("User Connected to /user/garageSales")
    let users = await User.findById(req.session.user_id).populate('GarageSale').exec()

    //users.user.password = "";

    console.log(users);
    res.send({users});

}catch(error){
    res.send(error)
}
});

//logs the user out and deletes their session from the db.
router.post('/users/logout',authenticateUser,(req,res)=>{
req.session.destroy(()=>{
console.log("Logged out successfully");
res.send({log:"Logged user out"})
});
});

//deletes user from the database.
//this router goes un
router.delete('/user/delete',authenticateUser,(req,res)=>{

});


//Prints out every user, their garageSales and the Items at those garageSales
//basically just a db dumb.
router.get('/summary',authenticateUser, async (req, res) => {
    try {
        const users = await User.find()
                              .populate({
                                  path: 'GarageSale',
                                  populate: {
                                      path: 'items',
                                      model: 'Item'
                                  }
                              });
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});


//makes sure the user is logged in
async function authenticateUser(req,res,next){
    console.log(req.session)
    //pulls the session info from the cookie
    //and checks to see if that user is in the db.
    if(!req.session.user_id){
        console.log("Unauthorized user")
        return res.send({error:"Unauthroized user"})
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