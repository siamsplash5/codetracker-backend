const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userModel = mongoose.connection.useDb('users');

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
        Inistitution: {
            type: String,
            trim: true,
            default: '',
        },
        contestID: [String],
        submissionID: [String],
    },
    { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

const model = userModel.model('user', UserSchema);

module.exports = model;
