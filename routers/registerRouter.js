const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../database/models/User');
const { sendOTPVerificationMail } = require('../lib/sendMailer');
const { getOTP } = require('../lib/getOTP');
const userOTPVerificationModel = require('../database/models/UserOTPVerification');

const registerRouter = express.Router();

registerRouter.post('/', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).send('Bad Request');
            return;
        }

        username = username.trim();
        email = email.trim();
        password = password.trim();

        if (!username || !email || !password) {
            res.send("Username/Email/Password can't be empty");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.send('Enter a valid email address');
            return;
        }

        if (password.length < 8) {
            res.send('Password must contain a minimum of 8 characters');
            return;
        }

        const existingUsername = await userModel.findOne({ username });
        if (existingUsername) {
            res.send('This username is already in use');
            return;
        }

        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            res.send('This email is already in use');
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const { _id, otp, message } = await getOTP(username, email, hashedPassword);
        if (message === 'otp already exist') {
            res.send('OTP already sent');
            return;
        }

        await sendOTPVerificationMail(otp, username, email);

        res.cookie('uid', _id, { maxAge: 1000 * 60 * 60, httpOnly: true });
        res.send({
            status: 'PENDING',
            message:
                'A verification code has been sent to your email. Enter the verification code here to complete the registration.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// Verify the user with OTP
registerRouter.post('/verify', async (req, res) => {
    try {
        let { otp } = req.body;
        if (otp === null || otp === undefined) {
            res.status(400).send('Bad Request');
            return;
        }
        otp = otp.trim();
        const userID = req.cookies.uid;

        const registrationData = await userOTPVerificationModel.findById(userID);
        if (!registrationData) {
            console.log('userID not found');
            res.status(401).send(
                "Account record doesn't exist or has already been verified. Please sign up or log in."
            );
            return;
        }

        const { username, email, password, hashedOTP, expiresAt } = registrationData;

        const isValidOTP = await bcrypt.compare(otp, hashedOTP);
        if (!isValidOTP) {
            console.log('Invalid OTP');
            res.status(401).send(
                "Account record doesn't exist or has already been verified. Please sign up or log in."
            );
            return;
        }

        if (expiresAt <= Date.now()) {
            await userOTPVerificationModel.findByIdAndDelete(userID);
            console.log('OTP expired');
            res.status(401).send(
                "Account record doesn't exist or has already been verified. Please sign up or log in."
            );
            return;
        }

        await userModel.create({ username, email, password });
        await userOTPVerificationModel.findByIdAndDelete(userID);

        res.clearCookie('uid');
        res.send('Registration successful! Now log in to your account.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = registerRouter;
