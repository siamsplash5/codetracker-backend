// Import dependencies
import Atcoder from '../models/AtcoderProblem.js';
import Codeforces from '../models/CodeforcesProblem.js';
import Spoj from '../models/SpojProblem.js';
import Timus from '../models/TimusProblem.js';

/**
 * Get the volume of Atcoder problem based on problem ID
 *
 * @param {string} problemID - Problem ID
 * @returns {number} - Problem volume
 * @throws {Error} - If an error occurs or invalid input is provided
 */

function getAtcoderVolume(problemID) {
    try {
        const regex = /^(abc|arc)\d{3}_[a-zA-Z\d]+$/;
        if (!regex.test(problemID)) {
            return 0;
        }

        const regex2 = /(abc|arc)(\d+)/;
        const match = regex2.exec(problemID);
        if (match) {
            const contestID = parseInt(match[2], 10);
            return Math.ceil(contestID / 50);
        }

        return null;
    } catch (error) {
        throw new Error('Invalid Url');
    }
}

/**
 * Get the volume of Codeforces problem based on problem ID
 *
 * @param {string} problemID - Problem ID
 * @returns {number} - Problem volume
 * @throws {Error} - If an error occurs or invalid input is provided
 */

function getCodeforcesVolume(problemID) {
    try {
        const matches = problemID.match(/^(\d+)([a-zA-Z0-9]+)$/);
        const contestID = parseInt(matches[1], 10);
        console.log(contestID);
        if (Number.isNaN(contestID)) {
            throw new Error();
        }
        return Math.ceil(contestID / 200);
    } catch (error) {
        console.log(error);
        throw new Error('Invalid Url');
    }
}

// eslint-disable-next-line no-unused-vars
function getSpojVolume(problemID) {
    return 0;
}

function getTimusVolume(problemID) {
    try {
        const volume = Math.ceil((Number(problemID) - 1000) / 300);
        return volume;
    } catch (error) {
        throw new Error('Invalid Url');
    }
}

function getModelAndVolume(judge, problemID) {
    if (judge === 'atcoder') {
        const volume = getAtcoderVolume(problemID);
        const problemModel = Atcoder;
        return { volume, problemModel };
    }
    if (judge === 'codeforces') {
        const volume = getCodeforcesVolume(problemID);
        const problemModel = Codeforces;
        return { volume, problemModel };
    }
    if (judge === 'spoj') {
        const volume = getSpojVolume(problemID);
        const problemModel = Spoj;
        return { volume, problemModel };
    }
    if (judge === 'timus') {
        const volume = getTimusVolume(problemID);
        const problemModel = Timus;
        return { volume, problemModel };
    }
    return null;
}

/**
 * Get the problem object from the database
 *
 * @param {string} judge - Judge name
 * @param {string} problemID - Problem ID
 * @returns {Promise<object|string|null>} - Problem object or 'not found' string if not found,
 * or null if invalid judge name
 * @throws {Error} - If an error occurs
 */

export const readProblem = async (judge, problemID) => {
    try {
        const { volume, problemModel } = getModelAndVolume(judge, problemID);
        const data = await problemModel.findOne(
            { volume, 'problems.problemID': problemID },
            { 'problems.$': 1 }
        );
        if (data === null) {
            return 'not found';
        }
        return data.problems[0];
    } catch (error) {
        console.error(error);
        throw new Error('Error when reading problem info from the database');
    }
};

/**
 * Create a problem object in the database
 *
 * @param {string} judge - Judge name
 * @param {object} problem - Problem object
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs
 */

export const createProblem = async (judge, problem) => {
    try {
        console.log('Create problem called');
        const { problemID } = problem;
        const { volume, problemModel } = getModelAndVolume(judge, problemID);
        const volumeDocument = await problemModel.findOne({ volume });
        if (volumeDocument !== null) {
            await problemModel.updateOne({ volume }, { $push: { problems: problem } });
        } else {
            const data = { volume, problems: [problem] };
            await problemModel.create(data);
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error when creating problem info in the database');
    }
};
