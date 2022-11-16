const collections = require ('../models/collections')
const mongoose = require ('mongoose')

const bannerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId, ref : "categories",
        required : true
    },
    image : {
        type : Array
    },
    description : {
        type : String
    }
})

const banner = mongoose.model(collections.banner, bannerSchema)
module.exports = banner
