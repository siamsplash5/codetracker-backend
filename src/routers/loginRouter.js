const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../database/models/User');
const { passwordRecoveryMail } = require('../lib/sendMailer');
const userOTPVerificationModel = require('../database/models/UserOTPVerification');
const { getOTP } = require('../lib/getOTP');

const loginRouter = express.Router();
const maxAge = 24 * 60 * 60; // 24 hours

/**
 * POST /login
 * User login
 */
loginRouter.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('Username/password is missing');
            res.send("Username/Password field can't be empty");
            return;
        }

        const user = await userModel.findOne({ username });

        if (!user) {
            console.log('User not found in database');
            res.send('Invalid Username/Password');
            return;
        }

        const { _id, password: hashedPassword } = user;

        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            console.log('Incorrect password');
            res.send('Invalid Username/Password');
            return;
        }

        const token = jwt.sign({ id: _id, user: username }, process.env.JWT_SECRET, {
            expiresIn: maxAge,
        });

        res.clearCookie('jwt');
        res.clearCookie('uid');
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.send('SUCCESS');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

loginRouter.post('/passwordRecovery', async (req, res) => {
    try {
        let { username } = req.body;

        if (!username) {
            console.log('Username is missing');
            res.send("Username can't be empty");
            return;
        }

        username = username.trim();

        const user = await userModel.findOne({ username });

        if (!user) {
            console.log('User not found');
            res.send('Invalid Username');
            return;
        }

        const { email, password } = user;

        const { otp, _id } = await getOTP(username, email, password);

        await passwordRecoveryMail(otp, username, email);

        res.cookie('uid', _id);
        res.send('success');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

loginRouter.post('/passwordRecovery/verify', async (req, res) => {
    try {
        let { otp, newPassword } = req.body;

        if (!otp || !newPassword) {
            res.send('Bad Request');
            return;
        }

        otp = otp.trim();
        const userID = req.cookies.uid;
        newPassword = newPassword.trim();

        // Get the registration info from the database
        const userOTP = await userOTPVerificationModel.findById(userID);

        // Check if the registration data is found or not
        if (!userOTP) {
            console.log('userID not found');
            res.send('Invalid OTP');
            return;
        }

        const { username, hashedOTP, expiresAt } = userOTP;

        // Check if the given OTP is valid
        const isValidOTP = await bcrypt.compare(otp, hashedOTP);
        if (!isValidOTP) {
            console.log('Invalid OTP');
            res.send('Invalid OTP');
            return;
        }

        // Check if the OTP is expired
        if (expiresAt <= Date.now()) {
            await userOTPVerificationModel.findByIdAndDelete(userID);
            console.log('OTP date expired');
            res.send('Invalid OTP');
            return;
        }

        await userOTPVerificationModel.findByIdAndDelete(userID);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await userModel.updateOne({ username }, { password: hashedPassword });

        res.clearCookie('uid');
        res.send({ message: 'success', username });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = loginRouter;
