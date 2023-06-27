import mongoose from 'mongoose';

const problemDb = mongoose.connection.useDb('problems');

const problemSchema = new mongoose.Schema({
    judge: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    problemID: {
        type: String,
        required: true,
        trim: true,
        index: true,
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
        default: null,
    },
    problemStatement: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
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
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    score: {
        type: String,
        default: null,
    },
    rating: {
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
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    parsedAt: Date,
});

problemSchema.index({ contestID: 1, username: 1 });

const Model = problemDb.model('problem', problemSchema);

export default Model;
