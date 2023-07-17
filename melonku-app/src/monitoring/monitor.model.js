const mongoose = require('mongoose');

// User Schema
const TempSchema = new mongoose.Schema({
    deviceID: {type: String, required: true},
    temp: {type: String, required: true},
    date: {type: Date, required: true},
    sourceGudang: {type: String, required: true}
})

// User model
const Temp = mongoose.model('Temp', TempSchema)

module.exports = Temp