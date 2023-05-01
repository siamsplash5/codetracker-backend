/* eslint-disable prettier/prettier */

// dependencies
const mongoose = require('mongoose').connection.useDb('bots');
const botSchema = require('../schemas/bot_schema');

// create model for documents
const Bot = mongoose.model('Bot', botSchema);

// module scaffolding
const helper = {};
const allowedJudges = ['atcoder', 'codeforces', 'spoj', 'timus'];

// get the bot account info from database
helper.readInfo = async (_userName, _judge) => {
    try {
        const judge = _judge.toLowerCase();
        const userName = _userName.toLowerCase();

        if (allowedJudges.includes(judge) === false) {
            throw new Error('Invalid judge name');
        }
        const projection = {};
        projection.username = 1;
        projection.password = 1;
        projection[`${judge}Credentials`] = 1;

        const data = await Bot.findOne({ username: userName }, projection);
        if (data === null) {
            throw new Error('Data not found');
        }
        return data;
    } catch (error) {
        throw new Error(error);
    }
};

// create the bot data for in the beginning phase
helper.createInfo = async (info) => {
    try {
        Bot.create(info);
    } catch (error) {
        throw new Error('Error when create bot info in database');
    }
};

// update data with new cookies if old one get expired or bot account get log out
helper.updateInfo = async (userName, _judge, info) => {
    try {
        const judge = _judge.toLowerCase();
        if (allowedJudges.includes(judge) === false) {
            throw new Error('Invalid judge name');
        }
        await Bot.updateOne(
            { username: userName },
            {
                $set: {
                    [`${judge}Credentials`]: info,
                },
            },
        );
    } catch {
        throw new Error('Error when update bot info in database');
    }
};

module.exports = helper;
