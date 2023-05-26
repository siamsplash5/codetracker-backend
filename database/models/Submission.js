import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const submissionDb = mongoose.connection.useDb('submissions');

// Define the schema for the submission document
const submissionSchema = new mongoose.Schema({
    volume: {
        type: Number,
        required: true,
        unique: true,
    },
    submissions: [
        {
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
                enum: ['atcoder', 'codeforces', 'spoj', 'timus'],
                required: [true, "can't be blank"],
            },
            contestID: {
                type: Number,
                default: 0,
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
            submitTime: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

// Apply the uniqueValidator plugin to the submissionSchema
submissionSchema.plugin(uniqueValidator, { message: 'is already taken.' });

// Create and export the submission model
const Submission = submissionDb.model('Submission', submissionSchema);

export default Submission;
