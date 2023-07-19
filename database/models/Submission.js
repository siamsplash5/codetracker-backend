import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const db = mongoose.connection.useDb('codetrackervj');

// Define the schema for the submission document
const submissionSchema = new mongoose.Schema({
    realJudgesSubmissionID: {
        type: Number,
        unique: true,
    },
    submittedBy: {
        type: String,
        required: [true, "can't be blank"],
        trim: true,
    },
    botWhoSubmitted: {
        type: String,
        required: [true, "can't be blank"],
        trim: true,
    },
    judge: {
        type: String,
        enum: ['Atcoder', 'Codeforces', 'Spoj', 'Timus'],
        required: [true, "can't be blank"],
    },
    vjContest: {
        contestID: {
            type: Number,
            default: 0,
        },
        problemIndex: {
            type: String,
        },
        beginTime: {
            type: Number,
            default: 0,
        },
        contestLength: {
            type: Number,
            default: 0,
        },
    },
    problemID: {
        type: String,
        required: [true, "can't be blank"],
    },
    problemName: {
        type: String,
        required: [true, "can't be blank"],
    },
    sourceCode: {
        type: String,
        required: true,
    },
    verdict: {
        type: String,
        required: [true, "can't be blank"],
    },
    language: {
        type: String,
        required: [true, "can't be blank"],
    },
    time: {
        type: String,
    },
    memory: {
        type: String,
    },
    submitDate: {
        type: String,
        required: true,
    },
    submitTime: {
        type: String,
        required: true,
    },
});

// Apply the uniqueValidator plugin to the submissionSchema
submissionSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Create and export the submission model
const Submission = db.model('Submission', submissionSchema);

export default Submission;
