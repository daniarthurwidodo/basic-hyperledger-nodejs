const mongoose = require('mongoose');

// Melon Schema
const MelonSchema = new mongoose.Schema({
    Melonname: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    nama: {type: String, required: true},
    email: {type: String, required: true},
    noHandphone: {type: String, required: true}

})

// Melon model
const Melon = mongoose.model('Melon', MelonSchema)

module.exports = Melon