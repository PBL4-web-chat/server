const express = require('express');
const router = express.Router();

const User = require('../models/User');


router.get('/find/:regex', async(req, res) => {
    const { regex } = req.params;

    if(!regex)
        return res
            .status(400)
            .json({success: false, message: "missing context"})
    
    try{
        const data = await User.find( {username: {$regex: regex, $options: "$i"}} );

        let userList = [];
        data.forEach(user => {
            userList = [...userList, {id: user.id, username: user.username}]
        })

        res.status(200).json({success: true, message: "users found", data: userList});
        
    } catch(err){
        return res.status(500).json({success: false, message: "internal server error"});
    }
})

module.exports = router;