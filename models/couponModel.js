const mongoose = require('mongoose')
const collections = require('../models/collections')

const couponSchema = new mongoose.Schema({
    code : {type : String},
    discount : {type : Number},
    userId : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    }]
})

const coupon = mongoose.model(collections.coupon, couponSchema)
module.exports = coupon