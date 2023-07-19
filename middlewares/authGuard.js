/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import blacklistedToken from '../database/models/BlacklistedTokens.js';
import userModel from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';

// Middleware to check if the JSON Web Token is valid and authenticated
const authGuard = async (req, res, next) => {
    try {
        // Check if the token exists in the cookie
        // const token = req.cookies.JSESSIONID;
        const { token } = req.body;
        if (!token) {
            console.log('Token not found');
            return responseHandler.unauthorize(res, "You're logged out. Please login.");
        }

        // Check if the token is blacklisted
        const isBlacklisted = await blacklistedToken.findOne({ token });
        if (isBlacklisted) {
            console.log('Token is blacklisted');
            return responseHandler.unauthorize(res, "You're logged out. Please login.");
        }

        // Verify the token and extract the user information
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, user } = decodedToken;

        // Check if the token's user ID exists in the database
        const foundUser = await userModel.findById(id);
        if (!foundUser) {
            console.log('Token user ID not found in the database');
            return responseHandler.unauthorize(res, "You're logged out. Please login.");
        }

        // Check if the token's username is valid
        if (foundUser.username !== user) {
            console.log('Token username is invalid');
            return responseHandler.unauthorize(res, "You're logged out. Please login.");
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
            return responseHandler.unauthorize(res, "You're logged out. Please login.");
        }
        responseHandler.error(res);
    }
};

export default authGuard;
