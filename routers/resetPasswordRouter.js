import express from 'express';
import userModel from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';
import getOTP from '../lib/getOTP.js';
import { passwordRecoveryMail } from '../lib/sendMailer.js';

const resetPasswordRouter = express.Router();

resetPasswordRouter.post('/', async (req, res) => {
    try {
        const { username } = req.body;

        const user = await userModel.findOne({ username });

        if (!user) {
            console.log('User not found');
            return responseHandler.badRequest(res, 'Invalid username');
        }

        const { email, password } = user;

        const { otp, _id, message } = await getOTP(username, email, password);

        if (message === 'OTP already exists') {
            console.log(message);
            return responseHandler.badRequest(res, 'OTP already sent.');
        }

        await passwordRecoveryMail(otp, username, email);

        // res.cookie('uid', _id);
        responseHandler.pending(res, {
            status: 202,
            message: 'A OTP has been sent to your email. Enter the code here to procceed.',
            token: _id,
        });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default resetPasswordRouter;
