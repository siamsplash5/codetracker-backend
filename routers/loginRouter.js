const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../database/models/User');
const { passwordRecoveryMail } = require('../lib/sendMailer');
const { getOTP } = require('../lib/getOTP');

const loginRouter = express.Router();

// creating a login router
loginRouter.post('/', async (req, res) => {
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
    console.log(loginPassword);
    console.log(password);
    const isMatched = await bcrypt.compare(loginPassword, password);
    if (!isMatched) {
        console.log('User password did not matched');
        res.send('Invalid Username/Password');
        return;
    }
    res.send('Login Successful');
});

loginRouter.post('/recoverPassword', async (req, res) => {
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
        res.flash({
            status: 'PENDING',
            message:
                'A verification code has sent to your email. Enter the verification code here for procced.',
            userID: _id,
        });
        res.redirect('/verify');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = loginRouter;
