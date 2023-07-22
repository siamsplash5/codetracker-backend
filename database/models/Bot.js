import mongoose from 'mongoose';

// Define the schema for the bot document
const botSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        atcoderCredentials: {
            csrf: String,
            cookie: [String],
        },
        codeforcesCredentials: {
            csrf: String,
            ftaa: String,
            bfaa: String,
            cookie: String,
        },
        spojCredentials: {
            cookie: String,
        },
        timusCredentials: {
            judgeID: String,
        },
    },
    { timestamps: true }
);

// Create and export the bot model
const Bot = new mongoose.model('Bot', botSchema);

export default Bot;
