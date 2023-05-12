const express = require('express');
const jwt = require('jsonwebtoken');
const blacklistedJWT = require('../database/models/BlackListedJWT');

const logoutRouter = express.Router();

logoutRouter.get('/', async (req, res) => {
    try {
        const token = req.cookies.jwt;
        res.clearCookie('jwt');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { exp } = decodedToken;
        await blacklistedJWT.create({
            token,
            expiresAt: exp * 1000,
        });
        res.send('Logout successful');
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.send('Logout successful');
            return;
        }
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = logoutRouter;
