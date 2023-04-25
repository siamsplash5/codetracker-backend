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
    atcoderCsrf: String,
    atcoderCookie: [String],
});

module.exports = botSchema;
