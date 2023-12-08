//Contains the model for Users and shows how they will be stored on the DB

const mongoose = require('mongoose')

//Users will have a username and a password
const userSchema = new mongoose.Schema({
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true}
})

//references garageSales the user owns
userSchema.virtual('GarageSale',{
    ref:'GarageSale',
    localField:'_id',
    foreignField:'owner'
})


//references items the user owns
userSchema.virtual('Item',{
ref:'Item',
localField:'_id',
foreignField:'owner'
});

userSchema.set('toObject',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})

const User = mongoose.model('User', userSchema, 'Users')
module.exports = User