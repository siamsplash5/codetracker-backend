// Import dependencies
import Problem from '../models/Problem.js';

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
        const data = await Problem.findOne({ judge, problemID });
        if (data === null) {
            return 'not found';
        }
        return data;
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
        await Problem.create(problem);
    } catch (error) {
        console.error(error);
        throw new Error('Error when creating problem info in the database');
    }
};

/**
 * Return all problem from database
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs
 */

export const getAllProblem = async () => {
    try {
        const data = await Problem.find();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Error when getting all problem info in the database');
    }
};

export const getShortListedProblems = async (problemSet) => {
    try {
        const data = await Problem.find({ $or: problemSet }, { alias: 0 });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Error when getting short listed problem info in the database');
    }
};
