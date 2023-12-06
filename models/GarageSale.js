const mongoose = require('mongoose')

const garageSaleSchema = new mongoose.Schema({
    title:{type: String, default: "Garage Sale"},
    owner:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    date: {type: Date, default: Date.now, required:true},
    address: {type: String, required:true},
    startTime: {type:Number, required:true},
    endTime: {type:Number, required:true},
    items: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Item'}
    ]
})

garageSaleSchema.virtual('User',{
    ref:'User',
    localField:'owner',
    foreignField:'_id'
})

garageSaleSchema.virtual('Item',{
    ref:'Item',
    localField:'_id',
    foreignField:'owner'
})

garageSaleSchema.set('toObject',{virtuals:true})
garageSaleSchema.set('toJSON',{virtuals:true})

const GarageSale = mongoose.model("GarageSale", garageSaleSchema, 'Garage_Sales')
module.exports = GarageSale