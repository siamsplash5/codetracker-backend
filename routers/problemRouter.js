import express from 'express';
import Problem from '../database/models/Problem.js';
import User from '../database/models/User.js';
import { getAllProblem } from '../database/queries/problem_query.js';
import responseHandler from '../handlers/response.handler.js';
import createProblemUrl from '../lib/createProblemUrl.js';
import authGuard from '../middlewares/authGuard.js';
import problemRequestValidator from '../middlewares/problemRequestValidator.js';
import parseAtcoderProblem from '../services/parse_problem/atcoder_problem.js';
import parseCodeforcesProblem from '../services/parse_problem/codeforces_problem.js';
import parseSpojProblem from '../services/parse_problem/spoj_problem.js';
import parseTimusProblem from '../services/parse_problem/timus_problem.js';

const problemRouter = express.Router();

/**
 * GET api/problem/all
 * Return all problems from the database
 */

problemRouter.get('/all', async (req, res) => {
    try {
        const problemList = await getAllProblem();
        problemList.sort((a, b) => b.parsedAt - a.parsedAt);
        responseHandler.ok(res, problemList);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

/**
 * GET api/problem/all-fetch
 * Return some problems from the database
 * @Todo
 */

problemRouter.post('/all-fetch', problemRequestValidator, async (req, res) => {
    try {
        // eslint-disable-next-line prefer-const
        const { links: problemList } = req.body;

        problemList.forEach(async (link) => {
            const { judge, problemUrl } = link;
            if (judge === 'Atcoder') {
                await parseAtcoderProblem(judge, problemUrl);
            } else if (judge === 'Codeforces') {
                await parseCodeforcesProblem(judge, problemUrl);
            } else if (judge === 'Spoj') {
                await parseSpojProblem(judge, problemUrl);
            } else if (judge === 'Timus') {
                await parseTimusProblem(judge, problemUrl);
            }
        });
        responseHandler.ok(res, 'done');
    } catch (error) {
        console.log(error);
        if (error.message === 'Invalid Url') {
            responseHandler.badRequest(res, error.message);
        } else {
            responseHandler.error(res);
        }
    }
});

/**
 * POST api/problem/one
 * Return specific problem from database
 * First check it in database
 * If problem not found, then
 * 1. The problem will scrap from the corresponding judge
 * 2. Store the problem in database
 * 3. Return the problem to the user
 * 4. Report anything wrong occurs (eg. invalid URL/problemID)
 */

problemRouter.post('/one', problemRequestValidator, async (req, res) => {
    try {
        // eslint-disable-next-line prefer-const
        let { judge, problemID, problemUrl } = req.body;

        if (problemUrl === undefined) {
            problemUrl = createProblemUrl(judge, problemID);
            if (problemUrl === null) {
                responseHandler.badRequest(res, 'Invalid judge/problem ID');
            }
        }
        let problem;
        if (judge === 'Atcoder') {
            problem = await parseAtcoderProblem(judge, problemUrl);
        } else if (judge === 'Codeforces') {
            problem = await parseCodeforcesProblem(judge, problemUrl);
        } else if (judge === 'Spoj') {
            problem = await parseSpojProblem(judge, problemUrl);
        } else if (judge === 'Timus') {
            problem = await parseTimusProblem(judge, problemUrl);
        } else {
            return responseHandler.badRequest(res, 'Invalid online judge');
        }
        responseHandler.ok(res, problem);
    } catch (error) {
        console.log(error);
        if (error.message === 'Invalid URL') {
            responseHandler.badRequest(res, error.message);
        } else {
            responseHandler.error(res);
        }
    }
});

/**
 * DELETE api/problem/delete
 * Delete a problem from database
 * EXCLUSIVE to ADMIN only
 */

problemRouter.delete('/delete', authGuard, async (req, res) => {
    try {
        const { judge } = req.body;
        let { problemID } = req.body;
        if (judge === 'Atcoder') {
            problemID = problemID.toLowerCase();
        } else {
            problemID = problemID.toUpperCase();
        }
        const { username } = req;
        const { role } = await User.findOne({ username }).select({ role: 1 });
        if (role === 'guest') {
            return responseHandler.forbidden(res);
        }
        const result = await Problem.deleteOne({ judge, problemID });
        if (result.deletedCount === 1) {
            return responseHandler.ok(res, {
                status: 200,
                message: `${judge} - ${problemID} deleted succesfully`,
            });
        }
        responseHandler.notfound(res);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default problemRouter;
