/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const userModel = require('../database/models/User');
const blackListedJWT = require('../database/models/BlackListedJWT');

// Middleware to check if the JSON Web Token is valid and authenticated
const authGuard = async (req, res, next) => {
    try {
        // Check if the token exists in the cookie
        const token = req.cookies.jwt;
        if (!token) {
            console.log('Token not found');
            return res.send("You're logged out. Please login.");
        }

        // Check if the token is blacklisted
        const isBlacklisted = await blackListedJWT.findOne({ token });
        if (isBlacklisted) {
            console.log('Token is blacklisted');
            return res.send("You're logged out. Please login.");
        }

        // Verify the token and extract the user information
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, user } = decodedToken;

        // Check if the token's user ID exists in the database
        const foundUser = await userModel.findById(id);
        if (!foundUser) {
            console.log('Token user ID not found in the database');
            return res.send("You're logged out. Please login.");
        }

        // Check if the token's username is valid
        if (foundUser.username !== user) {
            console.log('Token username is invalid');
            return res.send("You're logged out. Please login.");
        }

        // Set user information in the request object for further use
        req.userDatabaseID = id;
        req.username = user;

        // Call the next middleware
        next();
    } catch (error) {
        console.error(error);

        if (error instanceof jwt.TokenExpiredError) {
            console.log('Token expired');
            return res.send("You're logged out. Please login.");
        }

        // Handle other errors
        res.status(500).send('Internal Server Error');
    }
};

module.exports = authGuard;
