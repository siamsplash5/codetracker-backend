const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const userModel = require('../database/models/User');
const randomStringGenerator = require('../lib/randomStringGenerator');
const userOTPVerificationModel = require('../database/models/UserOTPVerification');

const registerRouter = express.Router();

// nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

// mail sender function powered by nodemailer
async function sendOTPVerificationMail(otp, username, email) {
    try {
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'CodeTracker - Email Verfication',
            html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to CodeTracker!</title>
  </head>
  <body>
    <p>Hello, ${username}.</p>

    <p>Your email was provided for registration on CodeTracker. To confirm your registration, enter the following code in this <a href="https://localhost:5000/register/verify">link</a>.</p>

    <p><b>Code:<b> ${otp}</p>

    <p>After that, you will able to login into the system.</p>

    <p>This code is only valid for 1 hour only. Thank you for your choosing CodeTracker.</p>

    <p>If it was not you, just ignore this letter.</p>

    <p>With best regards,<br>
    CodeTracker Team.</p>
  </body>
</html>`,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

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
        password = await bcrypt.hash(password, saltRounds);
        const otp = randomStringGenerator({
            lowerCase: true,
            upperCase: true,
            numbers: true,
            specialChar: false,
            stringLen: 6,
        });
        // encrypt the otp
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        // store the registration credentials temporarily in database
        const { _id } = await userOTPVerificationModel.create({
            username,
            email,
            password,
            hashedOTP,
        });
        // send verifcation mail
        await sendOTPVerificationMail(otp, username, email);
        res.send({
            status: 'PENDING',
            message:
                'A verification code has sent to your email. Enter the verification code here for login.',
            userID: _id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// verify the user with otp
registerRouter.post('/verify', async (req, res) => {
    try {
        let { userID, otp } = req.body;
        if (userID === null || otp === null || userID === undefined || otp === undefined) {
            res.status(400).send('Bad Request/Internal Server Error');
            return;
        }
        userID = userID.trim();
        otp = otp.trim();
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
        res.send('Registration succesful! Now log in to your account.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = registerRouter;
