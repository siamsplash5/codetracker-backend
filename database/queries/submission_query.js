const mongoose = require('mongoose');
const userModel = require('../models/User');
const submisionModel = require('../models/Submission');

// module scaffolding
const helper = {};

// update problem object in database
helper.updateSubmission = async (userDatabaseID, submission) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await submisionModel.findOneAndUpdate(
            { volume: 1 },
            { $push: { submissions: submission } },
            { new: true, upsert: true, session }
        );

        const { _id } = result.submissions.pop();

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

        console.log(error);
        throw new Error(error);
    }
};

module.exports = helper;
