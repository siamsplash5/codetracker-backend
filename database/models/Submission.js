const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const submisionModel = mongoose.connection.useDb('submissions');
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
                enum: ['atcoder', 'codeforces', 'spoj, timus'],
                required: [true, "can't be blank"],
            },
            constestID: {
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

submissionSchema.plugin(uniqueValidator, { message: 'is already taken.' });

const model = submisionModel.model('submission', submissionSchema);

module.exports = model;
