const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Member = require('../models/Group_member');
const Contact = require('../models/Contact');

router.post('/add', async(req, res) => {
    const { user_id, conversation_id } = req.body;

    if(!user_id || !conversation_id) {
        return res
            .status(400)
            .json({ success: false, message: "missing context" });
    }

    try {
        const user = await User.findOne({ _id: user_id })

        if(!user) {
            return res.status(400).json({ success: false, message: "user not found" });
        }

        const member = new Member({
            user: user_id,
            conversation: conversation_id,
            nickname: user.username
        });

        await member.save();

        res.status(200).json({ success: true, message: "member added" })
    } catch(err) {
        res.status(500).json({ success: false, message: "unexpected error" });
    }
})

router.get('/get/:conversation_id', async(req, res) => {
    const { conversation_id } = req.params;

    if(!conversation_id)
        return res
            .status(400)
            .json({ success: false, message: "missing context" })

    try {
        const members = await Member.find({ conversation: conversation_id });

        let memberList = [];
        for(const member of members) {
            const contact = await Contact.findOne({ user: member.user });
            memberList = [...memberList, {
                user_id: member.user,
                contact_name: contact.name,
                nickname: member.nickname
            }]
        }

        res.status(200).json({ success: true, message: "members found", data: memberList });
    } catch(err) {
        res.status(500).json({ success: false, message: "internal server error" });
    }
})

module.exports = router;