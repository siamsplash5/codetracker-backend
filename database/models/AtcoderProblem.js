import mongoose from 'mongoose';

const atcoderDb = mongoose.connection.useDb('problems');

const problemSchema = new mongoose.Schema({
    volume: {
        type: Number,
        required: true,
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
            problemStatement: [
                {
                    type: String,
                    default: null,
                },
            ],
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
            notes: [
                {
                    type: String,
                    default: null,
                },
            ],
            score: {
                type: String,
                default: null,
            },
            source: {
                type: String,
                required: true,
            },
            parsedAt: Date,
        },
    ],
});

const AtcoderProblem = atcoderDb.model('Atcoder', problemSchema);
export default AtcoderProblem;
