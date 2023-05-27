/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt';
import userOTPVerificationModel from '../database/models/UserOTPVerification.js';
import randomStringGenerator from './randomStringGenerator.js';

/**
 * Generate OTP (One-Time Password) for user registration
 *
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} hashedPassword - User's hashed password
 * @returns {Object} - Object containing the generated OTP, ID, and message
 * @throws {Error} - If an error occurs during the process
 */

export default async function getOTP(username, email, hashedPassword) {
    try {
        // Create OTP
        const otp = randomStringGenerator({
            lowerCase: false,
            upperCase: false,
            numbers: true,
            specialChar: false,
            stringLen: 6,
        });

        // Encrypt the OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Store the registration credentials temporarily in the database
        const result = await userOTPVerificationModel.findOne({ username });

        let message = '';
        if (result !== null) {
            if (username === result.username && email === result.email) {
                message = 'OTP already exists';
                return { otp: null, _id: null, message };
            }
            await userOTPVerificationModel.deleteOne({ _id: result._id });
        }

        const { _id } = await userOTPVerificationModel.create({
            username,
            email,
            password: hashedPassword,
            hashedOTP,
        });

        return { _id, otp, message };
    } catch (error) {
        console.error(error);
        throw new Error('Error occurred while generating OTP');
    }
}
