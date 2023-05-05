const nodemailer = require('nodemailer');

const helper = {};

// nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

// mail sender function powered by nodemailer
helper.sendOTPVerificationMail = async (otp, username, email) => {
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
};

helper.passwordRecoveryMail = async (otp, username, email) => {
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

    <p>You have request for changing your password. Enter OTP to procceed the password recovery proccess.</p>

    <p><b>Code:<b> ${otp}</p>

    <p>This code is only valid for 1 hour only.</p>
    <p>After that, you will be able to reset your password.</p>

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
};

module.exports = helper;
