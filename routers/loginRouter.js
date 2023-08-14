import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';
import { loginValidator, runLoginValidation } from '../middlewares/runLoginValidation.js';

const loginRouter = express.Router();
const maxAge = 24 * 60 * 60 * 1000; // 24 hours
const errorMessage = 'Invalid username/password';

async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;
        // Check if the account exists
        const user = await userModel.findOne({ username });
        if (!user) {
            console.log('User not found in database');
            return responseHandler.badRequest(res, errorMessage);
        }

        // Check if the password of login request is valid
        const { _id, password: hashedPassword } = user;
        const isMatched = await bcrypt.compare(password, hashedPassword);
        if (!isMatched) {
            console.log('Incorrect password');
            return responseHandler.badRequest(res, errorMessage);
        }

        // Genereate authentication token
        const token = jwt.sign({ id: _id, user: username }, process.env.JWT_SECRET, {
            expiresIn: maxAge,
        });
        const data = {
            status: 200,
            message: `Welcome ${username}`,
            token,
        };
        responseHandler.ok(res, data);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}

loginRouter.post('/', loginValidator, runLoginValidation, handleLogin);

export default loginRouter;
