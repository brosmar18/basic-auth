'use strict';

const base64 = require('base-64');
const { userCollection } = require('../models');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        next('Invalid login');
        return;
    }

    let basicAuth = req.headers.authorization.split(' ').pop();
    let [username, password] = base64.decode(basicAuth).split(':');

    try {
        req.user = await userCollection.authenticateBasic(username, password);
        next();
    } catch (e) {
        res.status(403).send('Invalid Login');
    }
};