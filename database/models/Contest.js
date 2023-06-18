import mongoose from 'mongoose';

const contestModel = mongoose.connection.useDb('contests');

// Define the schema for the contest document
const contestSchema = new mongoose.Schema(
    {
        contestID: {
            type: Number,
        },
        owner: {
            type: String,
        },
        privacy: {
            type: String,
            enum: ['Public', 'Protected', 'Private'],
        },
        password: {
            type: String,
            required() {
                return this.privacy === 'Protected' || this.privacy === 'Private';
            },
            default: '',
            trim: true,
        },
        title: {
            type: String,
            required: true,
        },
        announcement: [
            {
                type: String,
                trim: true,
            },
        ],
        description: {
            type: String,
            default: '',
            trim: true,
        },
        startDate: {
            type: String,
            trim: true,
        },
        startTime: {
            type: String,
            trim: true,
        },
        length: {
            type: Number,
            required: true,
        },
        problemSet: [
            {
                judge: {
                    type: String,
                    enum: ['Atcoder', 'Codeforces', 'Spoj', 'Timus'],
                    required: true,
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

const counterSchema = new mongoose.Schema(
    {
        lastContestID: {
            type: Number,
        },
    },
    { timestamps: true }
);

export const Contest = contestModel.model('Contest', contestSchema);
export const Counter = contestModel.model('Counter', counterSchema);
