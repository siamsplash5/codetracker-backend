/* eslint-disable prettier/prettier */

// dependencies
const mongoose = require('mongoose');
const botSchema = require('./schemas/botSchema');

// create model for documents
const Bot = new mongoose.model('Bot', botSchema);

// module scaffolding
const helper = {};

// get the bot account info from database
helper.getInfo = async (userName) => {
    try {
        const data = await Bot.findOne({ username: userName });
        if (data === null) return [];
        return data;
    } catch (error) {
        throw new Error('Error when get bot info from database');
    }
};

// create the bot data for in the beginning phase
helper.createBot = async (info) => {
    try {
        const newBot = new Bot(info);
        await newBot.save();
    } catch (error) {
        throw new Error('Error when create bot info in database');
    }
};

// update data with new cookies if old one get expired or bot account get log out
helper.updateBot = async (info) => {
    try {
        const { username, csrf, cookie } = info;
        await Bot.updateOne(
            { name: username },
            {
                $set: {
                    atcoderCsrf: csrf,
                    atcoderCookie: cookie,
                },
            },
        );
    } catch {
        throw new Error('Error when update bot info in database');
    }
};

module.exports = helper;
