// dependencies
const mongoose = require('mongoose');

const botsDb = mongoose.connection.useDb('bots');

// schema defination for the bot document
const botSchema = new mongoose.Schema({
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
});

const model = botsDb.model('bot', botSchema);
module.exports = model;
