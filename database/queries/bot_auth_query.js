import BotModel from '../models/Bot.js';

const allowedJudges = ['atcoder', 'codeforces', 'spoj', 'timus'];

/**
 * Read the bot account info from the database
 *
 * @param {string} userName - User name
 * @param {string} judgeName - Judge name
 * @returns {Promise<object>} - Bot account info
 * @throws {Error} - If an error occurs or invalid input is provided
 */

export const readInfo = async (userName, judgeName) => {
    try {
        const judge = judgeName.toLowerCase();
        const username = userName.toLowerCase();

        if (!allowedJudges.includes(judge)) {
            throw new Error('Invalid judge name');
        }

        const projection = {
            username: 1,
            password: 1,
            [`${judge}Credentials`]: 1,
        };

        const data = await BotModel.findOne({ username }, projection);

        if (!data) {
        throw new Error('Data not found');
        }

        return data;
    } catch (error) {
        console.error('Error occurred while reading bot info:', error);
        throw new Error('Failed to read bot info from the database');
    }
};

/**
 * Create the bot data in the database
 *
 * @param {object} info - Bot account info
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs
 */
export const createInfo = async (info) => {
    try {
        await BotModel.create(info);
    } catch (error) {
        console.error('Error occurred while creating bot info:', error);
        throw new Error('Failed to create bot info in the database');
    }
};

/**
 * Update data with new cookies if the old ones expire or the bot account gets logged out
 *
 * @param {string} userName - User name
 * @param {string} judgeName - Judge name
 * @param {object} info - New cookies information
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs or invalid input is provided
 */

export const updateInfo = async (userName, judgeName, info) => {
    try {
        const judge = judgeName.toLowerCase();

        if (!allowedJudges.includes(judge)) {
            throw new Error('Invalid judge name');
        }

        await BotModel.updateOne(
            { username: userName },
            { [`${judge}Credentials`]: info }
        );
    } catch (error) {
        console.error('Error occurred while updating bot info:', error);
        throw new Error('Failed to update bot info in the database');
    }
};
