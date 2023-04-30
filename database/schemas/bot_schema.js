// dependencies
const mongoose = require('mongoose');

// schema defination for the bot document
const botSchema = mongoose.Schema({
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

module.exports = botSchema;
