import express from 'express';
import Submission from '../database/models/Submission.js';
import User from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';
import authGuard from '../middlewares/authGuard.js';

const submissionQueryRouter = express.Router();
/**
 * GET /submissionQueryRouter
 * Query User's submission for a particular problem
 */

submissionQueryRouter.post(
    '/specific-problem/:judge/:problemID/:contestID',
    authGuard,
    async (req, res) => {
        try {
            const { judge, problemID, contestID } = req.params;
            const { username } = req;
            const result = await Submission.find({
                submittedBy: username,
                judge,
                problemID,
                'vjContest.contestID': contestID,
            });
            result.reverse();
            responseHandler.ok(res, result);
        } catch (error) {
            console.log(error);
            responseHandler.error(res);
        }
    }
);

/**
 * GET /submissionQueryRouter
 * Query User's all submission for a specific contest
 */

submissionQueryRouter.post('/specific-contest/:contestID', async (req, res) => {
    try {
        const { contestID } = req.params;
        const { username } = req;
        const result = await Submission.find({
            submittedBy: username,
            'vjContest.contestID': contestID,
        });
        result.reverse();
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

submissionQueryRouter.post('/specific-user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const isUserExist = await User.findOne({ username });
        if (isUserExist === null) {
            responseHandler.notfound(res);
        } else {
            const currentDate = Date.now();

            const result = await Submission.find({
                submittedBy: username,
                $expr: {
                    $lt: [
                        { $add: ['$vjContest.beginTime', '$vjContest.contestLength'] },
                        currentDate,
                    ],
                },
            });

            result.reverse();
            responseHandler.ok(res, result);
        }
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default submissionQueryRouter;
