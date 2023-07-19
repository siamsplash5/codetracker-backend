import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const db = mongoose.connection.useDb('codetrackervj');

// Define the schema for the user OTP verification document
const UserOTPVerificationSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9._-]+$/, 'is invalid'],
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

UserOTPVerificationSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Create and export the user OTP verification model
const UserOTPVerification = db.model('UserOTPVerification', UserOTPVerificationSchema);

export default UserOTPVerification;
