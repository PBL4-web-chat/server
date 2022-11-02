const express = require('express');
const router = express.Router();
const User = require('../models/User');
const argon2 = require('argon2');

router.post('/register', async(req, res) => {
    const { username, password } = req.body;

    if(!username || !password)
        return res
            .status(400)
            .json({ success: false, message: "missing username or password" });

    try {
        const user = await User.findOne({ username: username });

        if(user)
            return res
                .status(400)
                .json({ success: false, message: "username already taken" })

        const hashedPWD = await argon2.hash(password);
        const newUser = new User({
            username: username,
            password: hashedPWD
        })

        await newUser.save();
        return res.status(200).json({ success: true, message: "user created" })
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: "unexpected error" })
    }
})

router.post('/login', async(req, res) => {
    const { username, password } = req.body;

    if(!username || !password)
        return res
            .status(400)
            .json({ success: false, message: "missing username or password" });

    try {
        const user = await User.findOne({ username });

        if(!user)
            return res
                .status(400)
                .json({ success: false, message: "user not existed" });

        if(await argon2.verify(user.password, password))
            return res.status(200).json({ success: true, message: "authenticated", access_token: user._id });
        else
            return res.status(400).json({ success: false, message: "incorrect password" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: "unexpected error" })
    }
})

module.exports = router;