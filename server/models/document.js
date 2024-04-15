const {Schema, model} = require('mongoose')

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

module.exports = model("Document", Document);