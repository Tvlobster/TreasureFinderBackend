const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {type:String, required:true},
    price: {type:Number, min:0, required:true},
    image: {type:String},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    buyers: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ]
})

const Item = mongoose.model('Item', itemSchema, 'Items')
module.exports = Item