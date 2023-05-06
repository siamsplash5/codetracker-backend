const jwt = require('jsonwebtoken');
const userModel = require('../database/models/User');
const blackListedJWT = require('../database/models/BlackListedJWT');

// check json web token exists & is verified
const authGuard = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token === null) {
            res.send("You're logged out. Please login.");
            return;
        }
        const result = blackListedJWT.findOne({ token });
        if (result !== null) {
            res.send("You're logged out. Please login.");
            return;
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, user } = decodedToken;
        const result2 = await userModel.findById({ _id: id });
        if (result2 === null) {
            res.send("You're logged out. Please login.");
            return;
        }
        const { username } = result;
        if (username !== user) {
            res.send("You're logged out. Please login.");
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = authGuard;
