const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupmemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'conversations',
    },
    nickname: {
        type: String,
    },
    joined_time: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('group_member', groupmemSchema);