const mongoose = require('mongoose')

const garageSaleSchema = new mongoose.Schema({
    owner:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    date: {type: Date, default: Date.now, required:true},
    address: {type: String, required:true},
    startTime: {type:Number, required:true},
    endTime: {type:Number, required:true},
    items: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Item"}
    ]
})

const GarageSale = mongoose.model("GarageSale", garageSaleSchema, 'Garage_Sales')
module.exports = GarageSale