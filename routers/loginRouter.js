const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../database/models/User');
const { passwordRecoveryMail } = require('../lib/sendMailer');
const userOTPVerificationModel = require('../database/models/UserOTPVerification');
const { getOTP } = require('../lib/getOTP');

const loginRouter = express.Router();

// creating a login router
loginRouter.post('/', async (req, res) => {
    try {
        const loginUsername = req.body.username;
        const loginPassword = req.body.password;
        if (
            loginUsername === undefined ||
            loginUsername === '' ||
            loginPassword === undefined ||
            loginPassword === ''
        ) {
            console.log('username/password undefined');
            res.send("Username/Password field can't be empty");
            return;
        }
        const result = await userModel.findOne({ username: loginUsername });
        if (result === null) {
            console.log('User info not found in database');
            res.send('Invalid Username/Password');
            return;
        }
        const { password } = result;
        const isMatched = await bcrypt.compare(loginPassword, password);
        if (!isMatched) {
            console.log('User password did not matched');
            res.send('Invalid Username/Password');
            return;
        }
        res.send('Login Successful');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

loginRouter.post('/passwordRecovery', async (req, res) => {
    try {
        let { username } = req.body;
        if (username === undefined || username === null || username === '') {
            console.log('Username undefined/null/empty');
            res.status(500).send('Bat request/Internal Server Error');
            return;
        }
        username = username.trim();
        const result = await userModel.findOne({ username });
        if (result === null) {
            console.log('User not found');
            res.send('Invalid Username');
            return;
        }
        const { email, password } = result;
        const { otp, _id } = await getOTP(username, email, password);
        await passwordRecoveryMail(otp, username, email);
        res.send({
            status: 'PENDING',
            message:
                'A verification code has sent to your email. Enter the verification code here for procced.',
            userID: _id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

loginRouter.post('/passwordRecovery/verify', async (req, res) => {
    try {
        let { userID, otp, newPassword } = req.body;
        if (
            userID === null ||
            otp === null ||
            newPassword === null ||
            userID === undefined ||
            otp === undefined ||
            newPassword === undefined
        ) {
            res.status(400).send('Bad Request');
            return;
        }
        userID = userID.trim();
        otp = otp.trim();
        newPassword = newPassword.trim();
        // get the registration info from database
        const result = await userOTPVerificationModel.findById({ _id: userID });
        // check if the registration data found or not
        if (result === null) {
            console.log('userID not found');
            res.status(401).send('Invalid OTP');
            return;
        }
        const { username, hashedOTP, expiresAt } = result;

        // check if the given otp is valid
        const isValidOTP = await bcrypt.compare(otp, hashedOTP);
        if (!isValidOTP) {
            console.log('Invalid OTP');
            res.status(401).send('Invalid OTP, try again');
            return;
        }
        // check if the otp is not expired
        if (expiresAt <= Date.now()) {
            await userOTPVerificationModel.findByIdAndDelete({ _id: userID });
            console.log('OTP date expired');
            res.status(401).send('OTP expired, try again');
            return;
        }
        await userOTPVerificationModel.findByIdAndDelete({ _id: userID });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await userModel.updateOne({ username }, { password: hashedPassword });

        res.send('Password recovery succesful! Now log in to your account.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = loginRouter;
