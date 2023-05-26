// Import dependencies
import BotModel from '../models/Bot.js';

// Create module scaffolding
const helper = {};

// List of allowed judges
const allowedJudges = ['atcoder', 'codeforces', 'spoj', 'timus'];

/**
 * Read the bot account info from the database
 *
 * @param {string} userName - User name
 * @param {string} judgeName - Judge name
 * @returns {Promise<object>} - Bot account info
 * @throws {Error} - If an error occurs or invalid input is provided
 */
helper.readInfo = async (userName, judgeName) => {
    try {
        // Convert inputs to lowercase
        const judge = judgeName.toLowerCase();
        const username = userName.toLowerCase();

        // Validate judge name
        if (!allowedJudges.includes(judge)) {
            throw new Error('Invalid judge name');
        }

        // Define projection for MongoDB query
        const projection = {
            username: 1,
            password: 1,
        };
        projection[`${judge}Credentials`] = 1;

        // Fetch data from the database
        const data = await BotModel.findOne({ username }, projection);

        // Check if data exists
        if (!data) {
            throw new Error('Data not found');
        }

        return data;
    } catch (error) {
        console.error('Error occurred while reading bot info:', error);
        throw new Error('Error when reading bot info from the database');
    }
};

// Create the bot data in the database
helper.createInfo = async (info) => {
    try {
        await BotModel.create(info);
    } catch (error) {
        console.error('Error occurred while creating bot info:', error);
        throw new Error('Error when creating bot info in the database');
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
helper.updateInfo = async (userName, judgeName, info) => {
    try {
        // Convert judge name to lowercase
        const judge = judgeName.toLowerCase();

        // Validate judge name
        if (!allowedJudges.includes(judge)) {
            throw new Error('Invalid judge name');
        }

        await BotModel.updateOne(
            { username: userName },
            {
                $set: {
                    [`${judge}Credentials`]: info,
                },
            }
        );
    } catch (error) {
        console.error('Error occurred while updating bot info:', error);
        throw new Error('Error when updating bot info in the database');
    }
};

export default helper;
