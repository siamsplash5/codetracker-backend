const mongoose = require('mongoose');
const userModel = require('../models/User');
const submissionModel = require('../models/Submission');

// Create module scaffolding
const helper = {};

/**
 * Update the problem object in the database
 *
 * @param {string} userDatabaseID - User database ID
 * @param {object} submission - Submission object
 * @returns {Promise<object>} - Created or updated object
 * @throws {Error} - If an error occurs
 */
helper.updateSubmission = async (userDatabaseID, submission) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await submissionModel.findOneAndUpdate(
            { volume: 1 },
            { $push: { submissions: submission } },
            { new: true, upsert: true, session }
        );

        const { _id } = result.submissions[result.submissions.length - 1];

        await userModel.updateOne(
            { _id: userDatabaseID },
            { $push: { submissionID: _id } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return result; // Return the created or updated object
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        throw new Error('Error when updating submission in the database');
    }
};

module.exports = helper;
