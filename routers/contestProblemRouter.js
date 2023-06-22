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
        let problemIndex = 'A';
        let counter = 0;
        let flag = false;
        contestProblem.forEach((contest, index) => {
            // adding alias if there any
            if (problemSet[index].alias.length && contestProblem[index].title !== 'Error!') {
                contestProblem[index].title = problemSet[index].alias;
            }

            // adding problem index
            if (contestProblem[index].title !== 'Error!') {
                contestProblem[index].title = `${problemIndex}. ${contestProblem[index].title}`;
                if (!flag) {
                    // increment problem number by 1
                    problemIndex = String.fromCharCode(problemIndex.charCodeAt(0) + 1);
                } else {
                    // if cross 'Z' problem number will be 'A1', 'B1'
                    problemIndex = `${problemIndex}${counter}`;
                }
                if (problemIndex === 'Z') {
                    flag = true;
                    problemIndex = 'A';
                    counter += 1;
                }
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
