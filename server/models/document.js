const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Document = new Schema({
    _id: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
    },
    name:{
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Document", Document);