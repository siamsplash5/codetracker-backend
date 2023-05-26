const express = require('express');
const jwt = require('jsonwebtoken');
const blacklistedJWT = require('../database/models/BlackListedJWT');

const logoutRouter = express.Router();

logoutRouter.post('/', async (req, res) => {
    try {
        const token = req.cookies.jwt;
        res.clearCookie('jwt');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { exp } = decodedToken;
        await blacklistedJWT.create({
            token,
            expiresAt: exp * 1000,
        });
        res.send('SUCCESS');
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.send('SUCCESS');
            return;
        }
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = logoutRouter;
