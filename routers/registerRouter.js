import bcrypt from 'bcrypt';
import express from 'express';
import userModel from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';
import getOTP from '../lib/getOTP.js';
import { sendOTPVerificationMail } from '../lib/sendMailer.js';

const registerRouter = express.Router();

registerRouter.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUsername = await userModel.findOne({ username });
        if (existingUsername) {
            return responseHandler.badRequest(res, 'This username is already in use.');
        }

        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) return responseHandler.badRequest(res, 'This email is already in use.');

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const { _id, otp, message } = await getOTP(username, email, hashedPassword);
        if (message === 'otp already exist') {
            return responseHandler.badRequest(res, 'OTP already sent.');
        }

        await sendOTPVerificationMail(otp, username, email);

        res.cookie('uid', _id, { maxAge: 1000 * 60 * 60, httpOnly: true });

        responseHandler.pending(res, {
            status: 202,
            message: 'A OTP has been sent to your email. Enter the code here to procceed.',
        });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default registerRouter;
