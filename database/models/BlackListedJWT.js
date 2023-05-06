// dependencies
const mongoose = require('mongoose');

const blackListedJWTDb = mongoose.connection.useDb('blacklistedJWT');

// schema defination for the bot document
const blackListedJWTSchema = new mongoose.Schema({
    jwt: {
        type: String,
        required: true,
    },
});

const model = blackListedJWTDb.model('blacklistedJWT', blackListedJWTSchema);
module.exports = model;
