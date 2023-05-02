const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    volume: {
        type: Number,
        required: true,
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
            problemStatement: {
                background: {
                    type: String,
                    default: null,
                },
                problem: {
                    type: String,
                    default: null,
                },
                input: {
                    type: String,
                    default: null,
                },
                output: {
                    type: String,
                    default: null,
                },
            },
            sampleTestCase: {
                inputs: [
                    {
                        type: String,
                        default: null,
                    },
                ],
                outputs: [
                    {
                        type: String,
                        default: null,
                    },
                ],
            },
            notes: {
                type: String,
                default: null,
            },
            tags: [
                {
                    type: String,
                    default: null,
                },
            ],
            difficulty: {
                type: String,
                default: null,
            },
            source: {
                type: String,
                required: true,
            },
            author: {
                type: String,
                required: null,
            },
            parsedAt: Date,
        },
    ],
});

module.exports = problemSchema;
