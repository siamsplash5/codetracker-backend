import express from 'express';
import Submission from '../database/models/Submission.js';
import responseHandler from '../handlers/response.handler.js';

const submissionQueryRouter = express.Router();
/**
 * POST /submissionQueryRouter
 * Query User's submission for a particular problem
 */

submissionQueryRouter.get('/specific-problem/:judge/:problemID', async (req, res) => {
    try {
        const { judge, problemID } = req.params;
        const { username } = req;
        const result = await Submission.find({ submittedBy: username, judge, problemID });
        result.reverse();
        responseHandler.ok(res, result);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

/**
 * POST /submissionQueryRouter
 * Query User's submission for all problem
 */

submissionQueryRouter.get('/specific-user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const result = await Submission.find({ submittedBy: username });
        result.reverse();
        responseHandler.ok(res, result);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default submissionQueryRouter;
