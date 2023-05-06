const express = require('express');
const jwt = require('jsonwebtoken');
const blacklistedJWT = require('../database/models/BlackListedJWT');

const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { exp } = decodedToken;
    blacklistedJWT.create({
        token,
        expiresAt: exp,
    });
    res.clearCookie('jwt');
    res.send('Logout succesful');
});

module.exports = logoutRouter;
