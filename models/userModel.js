const mongoose = require('mongoose')
const collections = require('../models/collections')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    wishlist: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, ref: "products"

        }
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, ref: "products"
        },
        quantity: {
            type: Number
        },
        pricePerItem: {
            type: Number,
            default: 0
        }
    }],
    address: [{
        name: { type: String },
        locality: { type: String },
        state: { type: String },
        landmark: { type: String },
        pincode: { type: Number }
    }]
})

const User = mongoose.model(collections.users, userSchema)

module.exports = User

