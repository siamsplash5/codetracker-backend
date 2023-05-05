/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const randomStringGenerator = require('./randomStringGenerator');
const userOTPVerificationModel = require('../database/models/UserOTPVerification');

const helper = {};

helper.getOTP = async ({ username, email, password }) => {
    try {
        // create otp
        const otp = randomStringGenerator({
            lowerCase: true,
            upperCase: true,
            numbers: true,
            specialChar: false,
            stringLen: 6,
        });
        // encrypt the otp
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        // store the registration credentials temporarily in database
        const result = await userOTPVerificationModel.findOne({ username });
        let message = '';
        if (result !== null) {
            const _username = result.username;
            const _email = result.email;
            if (username === _username && email === _email) {
                message = 'otp already exist';
                return { otp: null, _id: null, message };
            }
            await userOTPVerificationModel.deleteOne({ _id: result._id });
        }
        const { _id } = await userOTPVerificationModel.create({
            username,
            email,
            password,
            hashedOTP,
        });
        return { _id, otp, message };
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

module.exports = helper;
