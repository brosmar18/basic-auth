'use strict';

const base64 = require('base-64');
const bcrypt = require('bcrypt');
const { userModel } = require('../models');

const basicAuth = async (req, res, next) => {
    let { authorization } = req.headers;
    let authString = authorization.split(' ')[1];
    let decodedAuthString = base64.decode(authString);
    let [username, password] = decodedAuthString.split(':');
    let user = await userModel.findOne({ where: {username} });

    if(user) {
        let validUser = await bcrypt.compare(password, user.password);
        if(validUser){
            req.user = user;
            next();
        } else {
            next('Not Authorized (password incorrect)');
        }
    } else {
        next('Not Authorized (user doesn\'t exist in DB');
    }
};

module.exports = basicAuth;
