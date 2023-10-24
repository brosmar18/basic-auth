'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const basicAuth = require('../auth/basicAuth');
const { userModel } = require('../models');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 5);
        let newUser = await userModel.create({
            username,
            password: encryptedPassword,
        });
        res.status(200).send(newUser);
    } catch (e) {
        next('signup error occurred');
    }
});

router.post('/signin', basicAuth, (req, res, next) => {
    res.status(200).send(req.user);
});

module.exports = router;
