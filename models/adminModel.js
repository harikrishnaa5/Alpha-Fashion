const mongoose = require('mongoose')
const collections = require('../models/collections')


const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password : String,
    mobile: Number
})

const admin = mongoose.model(collections.admin, adminSchema)

module.exports = admin
