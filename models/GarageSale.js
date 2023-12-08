//Contains the model for GarageSales and shows how they will be stored on the DB

const mongoose = require('mongoose')

//Garage Sales have a title, an owner (the host), the date that they will be held, the address they are held at, the starting and ending times, and a list of items
const garageSaleSchema = new mongoose.Schema({
    title:{type: String, default: "Garage Sale"}, 
    owner:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    date: {type: Date, default: Date.now, required:true},
    address: {type: String, required:true},
    startTime: {type:String, required:true},
    endTime: {type:String, required:true},
    items: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Item'}
    ]
})

//references users for the owner field
garageSaleSchema.virtual('User',{
    ref:'User',
    localField:'owner',
    foreignField:'_id'
})

//references items for the items field
garageSaleSchema.virtual('Item',{
    ref:'Item',
    localField:'items',
    foreignField:'_id',
    localField:'_id',
    foreignField:'owner'
})

garageSaleSchema.set('toObject',{virtuals:true})
garageSaleSchema.set('toJSON',{virtuals:true})

const GarageSale = mongoose.model("GarageSale", garageSaleSchema, 'Garage_Sales')
module.exports = GarageSale