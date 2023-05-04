const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userOTPVerificationModel = mongoose.connection.useDb('users');

const UserOTPVerficationSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        hashedOTP: {
            type: String,
            required: true,
            trim: true,
        },
        expiresAt: {
            type: Date,
            default: Date.now() + 3600000,
            index: { expires: '1h' },
        },
    },
    { timestamps: true }
);

UserOTPVerficationSchema.plugin(uniqueValidator, { message: 'is already taken.' });

const model = userOTPVerificationModel.model('users_verification', UserOTPVerficationSchema);

module.exports = model;
