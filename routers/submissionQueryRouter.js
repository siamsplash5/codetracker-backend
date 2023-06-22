import express from 'express';
import Submission from '../database/models/Submission.js';
import User from '../database/models/User.js';
import responseHandler from '../handlers/response.handler.js';

const submissionQueryRouter = express.Router();
/**
 * POST /submissionQueryRouter
 * Query User's submission for a particular problem
 */

submissionQueryRouter.get('/specific-problem/:judge/:problemID/:contestID', async (req, res) => {
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
});

/**
 * POST /submissionQueryRouter
 * Query User's submission for all problem
 */

submissionQueryRouter.get('/specific-user/:username', async (req, res) => {
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
