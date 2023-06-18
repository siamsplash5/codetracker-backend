import express from 'express';
import { Contest as contestModel, Counter as counterModel } from '../database/models/Contest.js';
import responseHandler from '../handlers/response.handler.js';

const contestRouter = express.Router();

/**
 * POST /contest
 * Create a new contest
 */
contestRouter.post('/', async (req, res) => {
    try {
        const contest = req.body;
        const counterID = '648e46e22c37934c74b20b45';
        contest.owner = req.username;
        contest.contestID = (await counterModel.findOne({ _id: counterID })).lastContestID + 1;
        await counterModel.updateOne({ _id: counterID }, { lastContestID: contest.contestID });
        const createdContest = await contestModel.create(contest);
        responseHandler.created(res, createdContest);
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
