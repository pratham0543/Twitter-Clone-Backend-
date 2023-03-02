const mongoose = require("mongoose")

const Tweet = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    content: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    likes: {
        type: mongoose.Schema.Types.Number,
        default: 0
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("Tweet", Tweet)