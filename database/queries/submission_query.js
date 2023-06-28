import mongoose from 'mongoose';
import { Standings } from '../models/Contest.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';

/**
 * Update the problem object in the database
 *
 * @param {string} userDatabaseID - User database ID
 * @param {object} submittedSolution - Submited solution object
 * @returns {Promise<object>} - Created or updated object
 * @throws {Error} - If an error occurs
 */

export const updateSubmission = async (userDatabaseID, submittedSolution) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await Submission.create([submittedSolution], { session });

        const { _id } = result[0];

        await User.updateOne(
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

/**
 * Update the problem object in the database
 *
 * @param {string} userDatabaseID - User database ID
 * @param {object} submittedSolution - Submited solution object
 * @returns {Promise<object>} - Created or updated object
 * @throws {Error} - If an error occurs
 */

export async function updateStandings({ contestID, username, problemIndex, verdict, submitTime }) {
    try {
        // Search for the document with contestID and username
        const standings = await Standings.findOne({ contestID, username });

        if (standings) {
            // Document found, update the submissions object

            // Find the index of the submissions object with the given problemIndex
            const submissionIndex = standings.submissions.findIndex(
                (submission) => submission.problemIndex === problemIndex
            );

            if (submissionIndex !== -1) {
                // Submission object found, update the values
                standings.submissions[submissionIndex].totalSubmission += 1;

                if (verdict === 'Accepted') {
                    if (standings.submissions[submissionIndex].isAccepted === false) {
                        standings.submissions[submissionIndex].isAccepted = true;
                        standings.submissions[submissionIndex].acceptedTime = submitTime;
                    }
                    standings.submissions[submissionIndex].totalAcceptedSubmission += 1;
                }
            } else {
                // Submission object not found, create a new one
                const newSubmission = {
                    problemIndex,
                    totalSubmission: 1,
                    isAccepted: verdict === 'Accepted',
                    totalAcceptedSubmission: verdict === 'Accepted' ? 1 : 0,
                    acceptedTime: verdict === 'Accepted' ? submitTime : 0,
                };

                standings.submissions.push(newSubmission);
            }

            // Save the updated document
            await standings.save();
        } else {
            // Document not found, create a new one
            const newStandings = new Standings({
                contestID,
                username,
                submissions: [
                    {
                        problemIndex,
                        totalSubmission: 1,
                        isAccepted: verdict === 'Accepted',
                        totalAcceptedSubmission: verdict === 'Accepted' ? 1 : 0,
                        acceptedTime: verdict === 'Accepted' ? submitTime : 0,
                    },
                ],
            });

            // Save the new document
            await newStandings.save();
        }

        console.log('Standings updated successfully!');
    } catch (error) {
        console.error('Error updating standings:', error);
    }
}
