const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    name: {
        type: String,
        require: true,
        default: ""
    },
    phoneNum: {
        type: String
    },
    gender: {
        type: String,
        default: "secret",
        enum: ['nam', 'nữ', "secret"],
    },
    email: {
        type: String
    }
})

module.exports = mongoose.model('contacts', ContactSchema);