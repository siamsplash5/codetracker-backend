const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const uniqueValidator = require('mongoose-unique-validator');

const submisionModel = mongoose.connection.useDb('submissions');

autoIncrement.initialize(submisionModel);

const submissionSchema = new mongoose.Schema({
    volume: {
        type: Number,
        required: true,
        unique: true,
    },
    submissionIDs: [
        {
            submissionID: {
                type: Number,
                unique: true,
            },
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
                type: Number,
                required: [true, "can't be blank"],
            },
            problemName: {
                type: String,
                required: [true, "can't be blank"],
            },
            sourceCode: {
                type: String,
                required: true,
                unique: true,
            },
            verdict: {
                type: String,
                required: [true, "can't be blank"],
            },
            langugage: {
                type: [String, Number],
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
submissionSchema.virtual('volume').get(function () {
    return Math.floor((this.submissionID - 1) / 1500) + 1;
});

submissionSchema.set('toObject', { virtuals: true });
submissionSchema.set('toJSON', { virtuals: true });

submissionSchema.plugin(autoIncrement.plugin, {
    model: 'Submission',
    field: 'submisssionID',
    startAt: 1,
    incrementBy: 1,
});

submissionSchema.pre('save', function (next) {
    // Calculate volume based on submissionID
    this.volume = Math.floor((this.submissionID - 1) / 1500) + 1;
    next();
});

submissionSchema.plugin(uniqueValidator, { message: 'is already taken.' });

const model = mongoose.model('Submission', submissionSchema);

module.exports = model;
