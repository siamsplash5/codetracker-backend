import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Define the schema for the user document
const UserSchema = new mongoose.Schema(
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
                type: mongoose.Types.ObjectId,
                ref: 'Submission',
            },
        ],
    },
    { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Create and export the user model
const User = new mongoose.model('User', UserSchema);

export default User;
