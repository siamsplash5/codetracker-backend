import bcrypt from 'bcrypt';
import express from 'express';
import userModel from '../database/models/User.js';
import userOTPVerificationModel from '../database/models/UserOTPVerification.js';
import responseHandler from '../handlers/response.handler.js';
import { otpValidator, runOTPValidation } from '../middlewares/otpValidation.js';

async function completeRegistration(req, res) {
    try {
        const { otp, token: userID } = req.body;
        // const userID = req.cookies.uid;

        const registrationData = await userOTPVerificationModel.findById(userID);
        if (!registrationData) {
            console.log('userID not found');
            return responseHandler.badRequest(res, 'Invalid OTP');
        }

        const { username, email, password, hashedOTP, expiresAt } = registrationData;

        const isValidOTP = await bcrypt.compare(otp, hashedOTP);
        if (!isValidOTP) {
            console.log('Invalid OTP');
            return responseHandler.badRequest(res, 'Invalid OTP');
        }

        if (expiresAt <= Date.now()) {
            await userOTPVerificationModel.findByIdAndDelete(userID);
            console.log('OTP expired');
            return responseHandler.badRequest(res, 'Invalid OTP');
        }

        await userModel.create({ username, email, password });
        await userOTPVerificationModel.findByIdAndDelete(userID);

        // res.clearCookie('uid');
        responseHandler.created(res, {
            status: 201,
            message: 'Registered Successfully!',
        });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}

const registrationVerifyRouter = express.Router();

registrationVerifyRouter.post('/', otpValidator, runOTPValidation, completeRegistration);

export default registrationVerifyRouter;
