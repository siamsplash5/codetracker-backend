import express from 'express';
import userModel from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';
import getOTP from '../lib/getOTP.js';
import { passwordRecoveryMail } from '../lib/sendMailer.js';
import {
    forgotPasswordRequestValidator,
    // eslint-disable-next-line prettier/prettier
    runForgotPasswordValidation
} from '../middlewares/forgotPasswordValidation.js';

async function handleForgotPassword(req, res) {
    try {
        // check if the user exist
        const { username } = req.body;
        const user = await userModel.findOne({ username });
        if (!user) {
            console.log('User not found');
            return responseHandler.badRequest(res, 'Invalid username');
        }

        // Send OTP to user's email for verification
        const { email, password } = user;
        const { otp, _id, message } = await getOTP(username, email, password);

        // Check if the OTP already sent to user's email
        if (message === 'OTP already exists') {
            console.log(message);
            responseHandler.badRequest(res, 'OTP already sent.');
        } else {
            await passwordRecoveryMail(otp, username, email);
            const options = {
                status: 202,
                message: 'A OTP has been sent to your email. Enter the code here to procceed.',
                token: _id,
            };
            responseHandler.pending(res, options);
        }
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.post(
    '/',
    forgotPasswordRequestValidator,
    runForgotPasswordValidation,
    handleForgotPassword
);

export default forgotPasswordRouter;
