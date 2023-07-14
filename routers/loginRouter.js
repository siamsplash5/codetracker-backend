import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';

const loginRouter = express.Router();
const maxAge = 24 * 60 * 60 * 1000; // 24 hours
const domain = '.codetrackervj.vercel.app';
/**
 * POST /login
 * User login
 */
loginRouter.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({ username });
        if (!user) {
            console.log('User not found in database');
            return responseHandler.badRequest(res, 'Invalid username/password');
        }

        const { _id, password: hashedPassword } = user;

        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            console.log('Incorrect password');
            return responseHandler.badRequest(res, 'Invalid username/password');
        }

        const token = jwt.sign({ id: _id, user: username }, process.env.JWT_SECRET, {
            expiresIn: maxAge,
        });

        // res.clearCookie('JSESSIONID', {
        //     httpOnly: true,
        //     domain,
        //     sameSite: 'None',
        //     secure: true,
        // });
        // res.clearCookie('uid', {
        //     httpOnly: true,
        //     domain,
        //     sameSite: 'None',
        //     secure: true,
        // });

        res.cookie('JSESSIONID', token, {
            httpOnly: true,
            maxAge,
            domain,
            sameSite: 'None',
            secure: true,
        });

        responseHandler.ok(res, {
            status: 200,
            message: `Welcome ${username}`,
        });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default loginRouter;
