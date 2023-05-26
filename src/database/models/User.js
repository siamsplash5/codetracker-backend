const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userModel = mongoose.connection.useDb('users');

// Define the schema for the user document
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
            index: true,
        },
        email: {
            type: String,
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
        role: {
            type: String,
            trim: true,
            default: 'guest',
            enum: ['admin', 'guest'],
        },
        nickname: {
            type: String,
            trim: true,
            default: '',
        },
        institution: {
            type: String,
            trim: true,
            default: '',
        },
        contestID: [
            {
                type: String,
            },
        ],
        submissionID: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Create and export the user model
const User = userModel.model('User', UserSchema);
module.exports = User;
