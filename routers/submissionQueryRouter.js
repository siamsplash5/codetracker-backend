import express from 'express';
import Submission from '../database/models/Submission.js';
import responseHandler from '../handlers/response.handler.js';

const submissionQueryRouter = express.Router();
/**
 * GET /submissionQueryRouter
 * Query User's submission for a particular problem
 */

submissionQueryRouter.post('/specific-problem', async (req, res) => {
    try {
        const { judge, problemID } = req.body;
        const { username } = req;
        const result = await Submission.find({ submittedBy: username, judge, problemID });
        responseHandler.ok(res, result);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

/**
 * GET /submissionQueryRouter
 * Query User's submission for all problem
 */

submissionQueryRouter.post('/all-problem', async (req, res) => {
    try {
        const { username } = req;
        const result = await Submission.find({ submittedBy: username });
        responseHandler.ok(res, result);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default submissionQueryRouter;
