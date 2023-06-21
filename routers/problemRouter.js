import express from 'express';
import responseHandler from '../handlers/response.handler.js';
import createProblemUrl from '../lib/createProblemUrl.js';
import parseAtcoderProblem from '../services/parse_problem/atcoder_problem.js';
import parseCodeforcesProblem from '../services/parse_problem/codeforces_problem.js';
import parseSpojProblem from '../services/parse_problem/spoj_problem.js';
import parseTimusProblem from '../services/parse_problem/timus_problem.js';

const problemRouter = express.Router();
/**
 * POST /problem Router
 * Return specific problem from database
 * First check it in database
 * If problem not found, then
 * 1. The problem will scrap from the corresponding judge
 * 2. Store the problem in database
 * 3. Return the problem to the user
 * 4. Report anything wrong occurs (eg. invalid url/problemID)
 */

problemRouter.post('/', async (req, res) => {
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
        if (error.message === 'Invalid Url') {
            responseHandler.badRequest(res, error.message);
        } else {
            responseHandler.error(res);
        }
    }
});

export default problemRouter;
