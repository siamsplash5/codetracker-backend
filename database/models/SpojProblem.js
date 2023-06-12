import mongoose from 'mongoose';

const spojDb = mongoose.connection.useDb('problems');

// Define the schema for the problem document
const problemSchema = new mongoose.Schema({
    volume: {
        type: Number,
        default: 0,
    },
    problems: [
        {
            judge: {
                type: String,
                required: true,
                trim: true,
            },
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
                type: String,
                default: null,
            },
            tags: [
                {
                    type: String,
                    default: null,
                },
            ],
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

// Create and export the spoj model
const Spoj = spojDb.model('Spoj', problemSchema);

export default Spoj;
