const mongoose = require('mongoose')
const { categories } = require('../models/collections')
const collections = require('../models/collections')

const categoriesSchema = new mongoose.Schema({
    category : {
        type : String
    },
    // productsIn: {
    //     type:Boolean,
    //     default:false
    // }
})

const Categories = mongoose.model(collections.categories, categoriesSchema)

module.exports = Categories
