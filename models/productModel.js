const mongoose = require('mongoose')
const collections = require('./collections')


const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId, ref : "categories",
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        requried : true
    },
    stock : {
        type : Number,
        required : true
    },
    image : {
        type : Array
    },
    deleted:{
        type:Boolean,
        default:false
    }
})

const Products = mongoose.model(collections.products, productSchema)
module.exports = Products