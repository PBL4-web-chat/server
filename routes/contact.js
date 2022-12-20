const express = require('express');
const router = express.Router();

const User = require('../models/User')
const Contacts = require('../models/Contact');

router.post('/create', async(req, res) => {
    const { user_id, name, phoneNum, gender, email } = req.body;

    if(!user_id)
        return res
            .status(400)
            .json({ success: false, message: "missing context" })

    try {
        const user = await User.findOne({ id: user_id });
        if(!user)
            return res
                .status(400)
                .json({ success: false, message: "user not found" })

        const contact = new Contacts({
            user: user_id,
            name: name,
            phoneNum: phoneNum,
            gender: gender,
            email: email ? email : ""
        })

        await contact.save();

        res.status(200).json({ success: true, message: "contact info added", data: {} })
    } catch(err) {
        res.status(500).json({ success: false, message: "internal server error", data: err })
    }
})

router.get('/getContactInfo/:user_id', async(req, res) => {
    const { user_id } = req.params;

    if(!user_id)
        return res
            .status(400)
            .json({ success: false, message: "missing context" })

    try {
        const contact = await Contacts.findOne({ user: user_id }, { __v: 0 });

        if(!contact)
            return res
                .status(400)
                .json({ success: false, message: "user contact not found" })

        res.status(200).json({ success: true, message: "contact info found", data: contact });
    } catch(err) {
        res.status(500).json({ success: false, message: "internal server error", data: err });
    }
})

module.exports = router;