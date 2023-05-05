const jwt = require('jsonwebtoken');
const userModel = require('../database/models/User');

const authGuard = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // check json web token exists & is verified
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const { id, user } = decodedToken;
            const result = await userModel.findById({ _id: id });
            if (result !== null || result !== undefined) {
                const { username } = result;
                if (username === user) {
                    next();
                } else {
                    res.send("You're logged out. Please login.");
                }
            } else {
                res.send("You're logged out. Please login.");
            }
            next();
        } else {
            res.send("You're logged out. Please login.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = authGuard;
