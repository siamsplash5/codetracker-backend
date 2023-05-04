const mongoose = require('mongoose');

const spojDb = mongoose.connection.useDb('problems');

const problemSchema = new mongoose.Schema({
    volume: {
        type: Number,
        default: 0,
    },
    problems: [
        {
            problemID: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            timeLimit: {
                type: String,
                required: true,
            },
            memoryLimit: {
                type: String,
                required: true,
            },
            sourceLimit: {
                type: String,
                required: true,
            },
            problemStatement: {
                problemFullBody: {
                    type: String,
                    default: null,
                },
            },
            sampleTestCase: {
                inputAndOutput: {
                    type: String,
                    default: null,
                },
            },
            source: {
                type: String,
                required: true,
            },
            author: {
                type: String,
                default: null,
            },
            parsedAt: Date,
        },
    ],
});

const model = spojDb.model('spoj', problemSchema);
module.exports = model;