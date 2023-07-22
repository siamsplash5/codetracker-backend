import express from 'express';
import mongoose from 'mongoose';
import { Contest as contestModel, Counter as counterModel } from '../database/models/Contest.js';
import responseHandler from '../handlers/response.handler.js';
import dateFormatter from '../lib/dateFormatter.js';

const contestRouter = express.Router();

/**
 * POST /contest
 * Create a new contest
 */
contestRouter.post('/create', async (req, res) => {
    try {
        const contest = req.body;
        const counterObjectID = '648e46e22c37934c74b20b45';

        const { convertedDate, convertedTime } = dateFormatter(contest.beginTime);

        contest.owner = req.username;
        contest.startDate = convertedDate;
        contest.startTime = convertedTime;

        // The creator of the contest will get registered by default
        contest.registered = [req.username];

        // Fetch the counterModel for the latest contest ID
        const counter = await counterModel.findById(counterObjectID);

        // Generate the contest ID
        contest.contestID = counter.lastContestID + 1;

        // Start a MongoDB transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update the counterModel with the latest contestID
            await counterModel.updateOne(
                { _id: counterObjectID },
                { lastContestID: contest.contestID },
                { session }
            );

            // Create a new contest
            const createdContest = await contestModel.create([contest], { session });

            // Update the created contest list of the user

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            responseHandler.created(res, createdContest);
        } catch (error) {
            // Abort the transaction in case of an error
            await session.abortTransaction();
            session.endSession();

            console.error(error);
            responseHandler.error(res);
        }
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

/**
 * POST /contest
 * Register to a contest
 */

contestRouter.post('/register', async (req, res) => {
    try {
        // Filter by contestID
        const filter = req.body;
        const update = { $push: { registered: req.username } };
        const options = { new: true };

        // Update contestModel with new registered username
        const updatedContest = await contestModel.findOneAndUpdate(filter, update, options);
        responseHandler.created(res, updatedContest);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

/**
 * PUT /contest
 * Update an existing contest
 */
// contestRouter.put('/', async (req, res) => {
//     try {
//         const { contestID, ...contestData } = req.body;
//         await contestModel.findByIdAndUpdate(contestID, contestData);
//         res.send('Contest updated successfully');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal server error');
//     }
// });

/**
 * DELETE /contest
 * Delete a contest
 */
// contestRouter.delete('/', async (req, res) => {
//     try {
//         const { contestID } = req.body;
//         await contestModel.findByIdAndDelete(contestID);
//         res.send('Contest deleted successfully');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal server error');
//     }
// });

export default contestRouter;
