const mongoose = require("mongoose")

const User = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    user_type: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    phone: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    dob: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    gender: {
        type: mongoose.Schema.Types.String,
        default: ""
    },
    location: {
        type: mongoose.Schema.Types.String,
        default: ""
    }
})

module.exports = mongoose.model("UserInfo", User)