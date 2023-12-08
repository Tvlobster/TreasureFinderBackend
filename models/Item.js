//Contains the model for Items and shows how they will be stored on the DB

const mongoose = require('mongoose')

//Items have a name, an owner, a price, an optional image, a description, a saleId for which garageSale they belong to, and a request for user who has requested the item
const itemSchema = new mongoose.Schema({
    name: {type:String, required:true},
    price: {type:Number, min:0, required:true},
    image: {type:String},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    description: {type:String},
    request: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    saleId: {type: mongoose.Schema.Types.ObjectId, ref: 'GarageSale'}
})

const Item = mongoose.model('Item', itemSchema, 'Items')
module.exports = Item