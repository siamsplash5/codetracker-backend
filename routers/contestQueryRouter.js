import express from 'express';
import { Contest as contestModel } from '../database/models/Contest.js';
import responseHandler from '../handlers/response.handler.js';

const contestQueryRouter = express.Router();

/**
 * GET /contest
 * Get all contest's list
 */
contestQueryRouter.get('/all', async (req, res) => {
    try {
        const allContestList = await contestModel.find();
        allContestList.reverse();
        responseHandler.ok(res, allContestList);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

/**
 * GET /contest list
 * GET user's contest list
 */
contestQueryRouter.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const usersContestList = await contestModel.find({ username });
        responseHandler.ok(res, usersContestList);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

/**
 * GET /contest
 * GET contest by contest ID
 */
contestQueryRouter.get('/contest/:contestID', async (req, res) => {
    try {
        const { contestID } = req.params;
        const contest = await contestModel.findOne({ contestID });
        responseHandler.ok(res, contest);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

/**
 * DELETE /contest
 * Delete a contest
 */
contestQueryRouter.delete('/', async (req, res) => {
    try {
        const { contestID } = req.body;
        await contestModel.findByIdAndDelete(contestID);
        res.send('Contest deleted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

export default contestQueryRouter;
