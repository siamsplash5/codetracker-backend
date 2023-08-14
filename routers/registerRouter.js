import bcrypt from 'bcrypt';
import express from 'express';
import userModel from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';
import getOTP from '../lib/getOTP.js';
import { sendOTPVerificationMail } from '../lib/sendMailer.js';
import { registrationValidator, runValidation } from '../middlewares/registrationValidation.js';

async function handleRegistration(req, res) {
    try {
        const { username, email, password } = req.body;

        // Check if the given username already in use
        const existingUsername = await userModel.findOne({ username });
        if (existingUsername) {
            return responseHandler.badRequest(res, 'This username is already in use.');
        }

        // Check if the given email already in use
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) return responseHandler.badRequest(res, 'This email is already in use.');

        // Encrypting user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Send OTP to user's provided email for verification
        const { _id, otp, message } = await getOTP(username, email, hashedPassword);
        if (message === 'otp already exist') {
            return responseHandler.badRequest(res, 'OTP already sent.');
        }
        await sendOTPVerificationMail(otp, username, email);

        // res.cookie('uid', _id, { maxAge: 1000 * 60 * 60, httpOnly: true });
        const options = {
            status: 202,
            message: 'A OTP has been sent to your email. Enter the code here to procceed.',
            token: _id,
        };
        responseHandler.pending(res, options);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}

const registerRouter = express.Router();
registerRouter.post('/', registrationValidator, runValidation, handleRegistration);

export default registerRouter;
