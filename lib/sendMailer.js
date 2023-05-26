import nodemailer from 'nodemailer';

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

/**
 * Send OTP verification email
 * @param {string} otp - OTP code
 * @param {string} username - Username
 * @param {string} email - Recipient email
 */

export const sendOTPVerificationMail = async (otp, username, email) => {
    try {
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'CodeTracker - Email Verification',
            html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to CodeTracker!</title>
          </head>
          <body>
            <p>Hello, ${username}.</p>
            <p>Your email was provided for registration on <b>CodeTracker</b>. To confirm your registration, enter the following code.</p>
            <p><b>OTP:  ${otp}</b> <br><br> This code is only valid for 1 hour. </p>
            <p>After that, you will be able to log in to the system.</p>
            <p>Thank you for choosing CodeTracker.</p>
            <p>If it was not you, just ignore this letter.</p>
            <p>With best regards,<br><b>CodeTracker Team.</b></p>
          </body>
        </html>`,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while sending OTP verification email');
    }
};

/**
 * Send password recovery email
 * @param {string} otp - OTP code
 * @param {string} username - Username
 * @param {string} email - Recipient email
 */

export const passwordRecoveryMail = async (otp, username, email) => {
    try {
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'CodeTracker - Password Recovery Request',
            html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to CodeTracker!</title>
          </head>
          <body>
            <p>Hello, ${username}.</p>
            <p>You have requested to change your password. Enter the OTP to proceed with the password recovery process.</p>
            <p><b>OTP:  ${otp}</b> <br><br> This code is only valid for 1 hour. </p>
            <p>After that, you will be able to reset your password.</p>
            <p>If it was not you, just ignore this letter.</p>
            <p>With best regards,<br><b>CodeTracker Team.</b></p>
          </body>
        </html>`,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        throw new Error('Error occurred while sending password recovery email');
    }
};
