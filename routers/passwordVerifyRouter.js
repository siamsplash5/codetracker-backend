import bcrypt from 'bcrypt';
import express from 'express';
import userModel from '../database/models/User.js';
import userOTPVerificationModel from '../database/models/UserOTPVerification.js';
import responseHandler from '../handlers/response.handler.js';

const passwordVerifyRouter = express.Router();

passwordVerifyRouter.post('/', async (req, res) => {
    try {
        const { otp, newPassword } = req.body;

        const userID = req.cookies.uid;

        // Get the registration request info from the database
        const userOTP = await userOTPVerificationModel.findById(userID);

        // Check if the registration request data is found or not
        if (!userOTP) {
            console.log('userID not found');
            return responseHandler.badRequest(res, 'Invalid OTP');
        }

        const { username, hashedOTP, expiresAt } = userOTP;

        // Check if the given OTP is valid
        const isValidOTP = await bcrypt.compare(otp, hashedOTP);
        if (!isValidOTP) {
            console.log('Invalid OTP');
            return responseHandler.badRequest(res, 'Invalid OTP');
        }

        // Check if the OTP is expired
        if (expiresAt <= Date.now()) {
            await userOTPVerificationModel.findByIdAndDelete(userID);
            console.log('OTP date expired');
            return responseHandler.badRequest(res, 'Invalid OTP');
        }

        await userOTPVerificationModel.findByIdAndDelete(userID);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await userModel.updateOne({ username }, { password: hashedPassword });

        res.clearCookie('uid');
        responseHandler.ok(res, {
            username,
            status: 200,
            message: 'Updating password successful',
        });
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default passwordVerifyRouter;
