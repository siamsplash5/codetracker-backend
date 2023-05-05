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
        if (
            username === undefined ||
            username === null ||
            email === undefined ||
            email === null ||
            password === undefined ||
            password === null
        ) {
            res.status(400).send('Bad Request/Internal Server Error');
            return;
        }
        // triming to remove extra whitespace before and after variable
        username = username.trim();
        email = email.trim();
        password = password.trim();
        // check if the variables are empty
        if (username === '' || email === '' || password === '') {
            res.send("Username/Email/Password can't be empty");
            return;
        }
        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.send('Enter valid email address');
            return;
        }
        // checking the password length
        if (password.length < 8) {
            res.send('Password must be contain minimum 8 characters');
            return;
        }
        // check if the username already in use
        const result = await userModel.find({ username });
        if (result && result.length > 0) {
            res.send('This username is currently in use');
            return;
        }
        // check if the email already in use
        const result2 = await userModel.find({ email });
        if (result2 && result2.length > 0) {
            res.send('This email is currently in use');
            return;
        }
        // encrypt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // getting the otp, this function will genereate otp and will store it on database
        // this will return the non-hashed otp and the database object id
        const { _id, otp, message } = await getOTP(username, email, hashedPassword);
        if (message === 'otp already exist') {
            res.send('OTP already send.');
            return;
        }
        // send verifcation mail
        await sendOTPVerificationMail(otp, username, email);
        res.cookie('uid', _id, { maxAge: 1000 * 60 * 60, httpOnly: true });
        res.send({
            status: 'PENDING',
            message:
                'A verification code has sent to your email. Enter the verification code here for login.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// verify the user with otp
registerRouter.post('/verify', async (req, res) => {
    try {
        let { otp } = req.body;
        if (otp === null || otp === undefined) {
            res.status(400).send('Bad Request');
            return;
        }
        otp = otp.trim();
        const userID = req.cookies.uid;
        // get the registration info from database
        const result = await userOTPVerificationModel.findById({ _id: userID });
        // check if the registration data found or not
        if (result === null) {
            console.log('userID not found');
            res.status(401).send(
                "Account record doesn't exist or verified already. Please sign up or login."
            );
            return;
        }
        const { username, email, password, hashedOTP, expiresAt } = result;

        // check if the given otp is valid
        const isValidOTP = await bcrypt.compare(otp, hashedOTP);
        if (!isValidOTP) {
            console.log('Invalid OTP');
            res.status(401).send(
                "Account record doesn't exist or verified already. Please sign up or login."
            );
            return;
        }
        // check if the otp is not expired
        if (expiresAt <= Date.now()) {
            await userOTPVerificationModel.findByIdAndDelete({ _id: userID });
            console.log('OTP date expired');
            res.status(401).send(
                "Account record doesn't exist or verified already. Please sign up or login."
            );
            return;
        }
        await userModel.create({ username, email, password });
        await userOTPVerificationModel.findByIdAndDelete({ _id: userID });
        res.clearCookie('uid');
        res.send('Registration succesful! Now log in to your account.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = registerRouter;
