const mongoose = require('mongoose')

//create a userSchema which will serve as a model for our users with relevant fields
const userSchema = new mongoose.Schema({
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true}
})


userSchema.virtual('GarageSale',{
    ref:'GarageSale',
    localField:'_id',
    foreignField:'owner'
})
userSchema.virtual('Item',{
ref:'Item',
localField:'_id',
foreignField:'owner'
});

userSchema.set('toObject',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})


const User = mongoose.model('User', userSchema, 'Users')
module.exports = User