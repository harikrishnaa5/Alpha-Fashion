const mongoose = require('mongoose')
const collections = require('./collections')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },


    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: {
            type: Number
        },
        pricePerItem: {
            type: Number
        },

    }],


    subtotal: {
        type: Number,
        default: 0
    },

    coupon: {
        type: String
    },

    discount: {
        type: Number
    },

    net: {
        type: Number
    },

    paymentMethod: {
        type: String
    },

    paymentStatus: {
        type: String
    },

    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    orderStatus: {
        type: String,
        default: 'Placed'
    },

    date: {
        type: String
    }
}, { timestamps: true }
)

const Order = mongoose.model(collections.orders, orderSchema)

module.exports = Order
























































// const mongoose = require('mongoose')
// const collections = require('../models/collections')

// const orderSchema = new mongoose.Schema({
//     userId : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : 'users'
//     },
//     products :[{
//         product : { 
//             type : mongoose.Schema.Types.ObjectId,
//             ref : 'products'
//         },

//         quantity : {
//             type : Number
//         },

//         pricePerItem : {
//         type : Number,
//         }
//     }],

//     subTotal : {
//         type : Number,
//         default : 0
//     },
//     coupon : {
//         type : String
//     },
//     discount : {
//         type : Number
//     },
//     total : {
//         type : Number
//     },
//     paymentMethod : {
//         type : String
//     },
//     paymentStatus : {
//         type : String
//     },
//     address : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : 'users'
//     },
//     orderStatus : {
//         type : String,
//         default : 'placed'
//     },
//     date : {
//         type : String
//     },
   
    
// },  {timestamps : true})

// const Order = mongoose.model(collections.orders, orderSchema)
// module.exports = Order