import mongoose from 'mongoose';

// Define the schema for the contest document
const contestSchema = new mongoose.Schema(
    {
        contestID: {
            type: Number,
            index: true,
        },
        owner: {
            type: String,
            index: true,
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
        description: {
            type: String,
            default: '',
            trim: true,
        },
        announcement: [
            {
                type: String,
                trim: true,
            },
        ],
        startDate: {
            type: String,
            trim: true,
        },
        startTime: {
            type: String,
            trim: true,
        },
        beginTime: {
            type: Number,
            required: true,
        },
        contestLength: {
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
                alias: {
                    type: String,
                    trim: true,
                    default: null,
                },
            },
        ],
        registered: [
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
            index: true,
        },
    },
    { timestamps: true }
);

const standingsSchema = new mongoose.Schema({
    contestID: {
        type: Number,
        required: true,
        index: true,
    },
    username: {
        type: String,
        required: true,
        index: true,
    },
    submissions: [
        {
            problemIndex: {
                type: String,
                index: true,
            },
            totalSubmission: {
                type: Number,
                default: 0,
            },
            totalAcceptedSubmission: {
                type: Number,
                default: 0,
            },
            isAccepted: {
                type: Boolean,
                default: false,
            },
            acceptedTime: {
                type: Number,
                default: 0,
            },
        },
    ],
});

contestSchema.index({ contestID: 1, owner: 1 });
standingsSchema.index({ contestID: 1, username: 1 });

export const Contest = new mongoose.model('Contest', contestSchema);
export const Counter = new mongoose.model('ContestCounter', counterSchema);
export const Standings = new mongoose.model('Standings', standingsSchema);
