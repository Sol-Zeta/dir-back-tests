const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    secret: {
        type: String
    }
})

module.exports = mongoose.model('users', UserSchema)