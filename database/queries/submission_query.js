import mongoose from 'mongoose';
import submissionModel from '../models/Submission.js';
import userModel from '../models/User.js';

/**
 * Update the problem object in the database
 *
 * @param {string} userDatabaseID - User database ID
 * @param {object} submittedSolution - Submited solution object
 * @returns {Promise<object>} - Created or updated object
 * @throws {Error} - If an error occurs
 */

const updateSubmission = async (userDatabaseID, submittedSolution) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await submissionModel.create([submittedSolution], { session });

        const { _id } = result;

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

export default updateSubmission;
