const mongoose = require('mongoose')

const garageSaleSchema = new mongoose.Schema({
    owner:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
    items: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Item"}
    ]
})

const GarageSale = mongoose.model("GarageSale", garageSaleSchema, 'Garage_Sales')
module.exports = GarageSale