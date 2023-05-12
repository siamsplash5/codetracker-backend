const mongoose = require('mongoose');

const contestModel = mongoose.connection.useDb('contests');

// Define the schema for the contest document
const contestSchema = new mongoose.Schema(
    {
        setter: {
            type: [String],
        },
        privacy: {
            type: String,
            enum: ['public', 'protected', 'private'],
        },
        password: {
            type: String,
            required() {
                return this.privacy === 'protected' || this.privacy === 'private';
            },
            default: '',
            trim: true,
        },
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: 'practice',
        },
        announcement: {
            type: String,
            default: '',
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        beginTime: {
            type: Date,
            default: Date.now() + 300000,
            trim: true,
        },
        duration: {
            type: String,
            required: true,
        },
        problemSet: [
            {
                judge: {
                    type: String,
                    enum: ['atcoder', 'codeforces', 'spoj', 'timus'],
                },
                problemID: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
        participants: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

// Create and export the contest model
const Contest = contestModel.model('Contest', contestSchema);
module.exports = Contest;
