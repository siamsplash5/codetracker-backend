const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../database/models/User');
const { passwordRecoveryMail } = require('../lib/sendMailer');
const userOTPVerificationModel = require('../database/models/UserOTPVerification');
const { getOTP } = require('../lib/getOTP');

const loginRouter = express.Router();
const maxAge = 24 * 60 * 60;
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
        const { _id, username, password } = result;
        const isMatched = await bcrypt.compare(loginPassword, password);
        if (!isMatched) {
            console.log('User password did not matched');
            res.send('Invalid Username/Password');
            return;
        }
        const token = jwt.sign({ id: _id, user: username }, process.env.JWT_SECRET, {
            expiresIn: maxAge,
        });
        res.clearCookie('jwt');
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
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
        res.cookie('uid', _id);
        res.send({
            status: 'PENDING',
            message:
                'A verification code has sent to your email. Enter the verification code here for procced.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

loginRouter.post('/passwordRecovery/verify', async (req, res) => {
    try {
        let { otp, newPassword } = req.body;
        if (
            otp === null ||
            newPassword === null ||
            otp === undefined ||
            newPassword === undefined
        ) {
            res.status(400).send('Bad Request');
            return;
        }
        otp = otp.trim();
        const userID = req.cookies.uid;
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
        res.clearCookie('uid');
        res.send('Password recovery succesful! Now log in to your account.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = loginRouter;
