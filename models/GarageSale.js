const mongoose = require('mongoose')

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

const GarageSale = mongoose.model("GarageSale", garageSaleSchema, 'Garage_Sales')
module.exports = GarageSale