const express = require('express');
const router = express.Router();

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

router.get('/getmsg/:conversation_id', async(req, res) => {
    const { conversation_id } = req.params;

    if(!conversation_id) {
        return res
            .status(400)
            .json({ success: false, message: "missing conversation_id" });
    }


    try {
        const conversation = await Conversation.findOne({ _id: conversation_id });

        if(!conversation) {
            return res
                .status(400)
                .json({ success: false, message: "conversation not found" });
        }

        const msgList = await Message.find({ conversation: conversation_id });
        res.status(200).json({ success: true, message: "conversation found", data: msgList });
    } catch(err) {
        res.status(500).json({ success: false, message: "unexpected error" });
    }
})

router.post('/postmsg', async(req, res) => {
    const { user_id, conversation_id, content } = req.body;

    if(!user_id || !conversation_id || !content) {
        return res
            .status(400)
            .json({ success: false, message: "missing context" })
    }

    try {
        const newMsg = new Message({
            user: user_id,
            conversation: conversation_id,
            content: content,
        })

        await newMsg.save();

        res
            .status(200)
            .send({ success: true, message: "message added" });
    } catch(err) {
        res.status(500).json({ success: false, message: "unexpected error" })
    }
})

module.exports = router;