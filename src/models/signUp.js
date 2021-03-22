const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: String
})

module.exports = mongoose.model('userModel', UserSchema)