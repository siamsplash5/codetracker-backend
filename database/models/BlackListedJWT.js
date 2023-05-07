// dependencies
const mongoose = require('mongoose');

const blackListedJWTDb = mongoose.connection.useDb('blacklistedJWT');

// schema defination for the bot document
const blackListedJWTSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 'expiresAt' },
    },
});

const model = blackListedJWTDb.model('blacklistedJWT', blackListedJWTSchema);
module.exports = model;
