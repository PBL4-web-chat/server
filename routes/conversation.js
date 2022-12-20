const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const Conversation = require('../models/Conversation');
const Member = require('../models/Group_member');

router.get('/:user_id', async(req, res) => {
    const { user_id } = req.params;

    if(!user_id) {
        return res
            .status(400)
            .json({ success: false, message: "missing userID" })
    }

    try {
        const memberList = await Member.find({ user: user_id });

        var listID = [];

        memberList.forEach(item => {
            listID = [...listID, item.conversation];
        });

        var conversationList = [];

        for(const id of listID) {
            const conversation = await Conversation.findOne({ _id: id });
            conversationList = [...conversationList, conversation];
        }

        res.status(200).json({ success: true, message: "data found", data: conversationList });
    } catch(err) {
        res.status(500).json({ success: false, message: "unexpected error" });
    }
})

router.get('/get/:conversation_id', async(req, res) => {
    const { conversation_id } = req.params;

    if(!conversation_id)
        return res
            .status(400)
            .json({ success: false, message: "missing conversation id" });

    try {
        const conversation = await Conversation.findById(ObjectId(conversation_id));

        if(!conversation)
            return res
                .status(400)
                .json({ success: false, message: "conversation not found" });

        res.status(200).json({ success: true, message: "conversation found", data: conversation });
    } catch(err) {
        res.status(500).json({ success: false, message: "unexpected error", data: err })
    }
})

router.post('/add', async(req, res) => {
    const { name } = req.body;

    if(!name)
        return res
            .status(400)
            .json({ success: false, message: "missing context" });

    try {
        const conversation = new Conversation({
            name: name
        })

        await conversation.save();

        res.status(200).json({ success: true, message: "conversation added", data: {id: conversation.id} });
    } catch(err) {
        res.status(500).json({ success: false, message: "unexpected error", data: err })
    }
})

module.exports = router;