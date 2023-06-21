import express from 'express';
import { getShortListedProblems } from '../database/queries/problem_query.js';
import responseHandler from '../handlers/response.handler.js';

const contestProblemRouter = express.Router();

/**
 * POST /problem Router
 * Return contests problem from database
 * First check it in database
 * If problem not found, then
 * 1. The problem will scrap from the corresponding judge
 * 2. Store the problem in database
 * 3. Return the problem to the user
 * 4. Report anything wrong occurs (eg. invalid url/problemID)
 */

contestProblemRouter.post('/all', async (req, res) => {
    try {
        const problemSet = req.body;
        const contestProblem = await getShortListedProblems(problemSet);
        contestProblem.forEach((contest, index) => {
            if (problemSet[index].alias.length) {
                contestProblem[index].title = problemSet[index].alias;
            }
        });
        responseHandler.ok(res, contestProblem);
    } catch (error) {
        console.log(error);
        if (error.message === 'Invalid Url') {
            responseHandler.badRequest(res, error.message);
        } else {
            responseHandler.error(res);
        }
    }
});

export default contestProblemRouter;
