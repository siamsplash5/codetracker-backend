const jwt = require('jsonwebtoken');
const userModel = require('../database/models/User');
const blackListedJWT = require('../database/models/BlackListedJWT');

// check json web token exists & is verified
const authGuard = async (req, res, next) => {
    try {
        // check the token is in the cookie
        const token = req.cookies.jwt;
        if (token === null) {
            console.log('token not found');
            res.send("You're logged out. Please login.");
            return;
        }
        // check the token is in the blacklist
        const result = await blackListedJWT.findOne({ token });
        if (result !== null) {
            console.log('token in the blacklist');
            res.send("You're logged out. Please login.");
            return;
        }
        // check the token info in the database
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, user } = decodedToken;
        const result2 = await userModel.findById({ _id: id });
        if (result2 === null) {
            console.log('token id not found in db');
            res.send("You're logged out. Please login.");
            return;
        }
        // check the token username valid
        const { username } = result2;
        if (username !== user) {
            console.log('token username invalid');
            res.send("You're logged out. Please login.");
            return;
        }
        // everything is fine, so called the next middleware
        req.userDatabaseID = id;
        req.username = user;
        next();
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            console.log('token expired');
            res.send("You're logged out. Please login.");
            return;
        }
        res.status(500).send('Internal Server Error');
    }
};

module.exports = authGuard;
