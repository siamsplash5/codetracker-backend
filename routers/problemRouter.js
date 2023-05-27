import express from 'express';
import responseHandler from '../handlers/response.handler.js';
import parseAtcoderProblem from '../services/parse_problem/atcoder_problem.js';
import parseCodeforcesProblem from '../services/parse_problem/codeforces_problem.js';
import parseSpojProblem from '../services/parse_problem/spoj_problem.js';
import parseTimusProblem from '../services/parse_problem/timus_problem.js';

const problemRouter = express.Router();

problemRouter.post('/', async (req, res) => {
    try {
        const { judge, problemUrl } = req.body;
        let problem;
        if (judge === 'atcoder') {
            problem = await parseAtcoderProblem(judge, problemUrl);
        } else if (judge === 'codeforces') {
            problem = await parseCodeforcesProblem(judge, problemUrl);
        } else if (judge === 'spoj') {
            problem = await parseSpojProblem(judge, problemUrl);
        } else if (judge === 'timus') {
            problem = await parseTimusProblem(judge, problemUrl);
        } else {
            return responseHandler.badRequest(res, 'Invalid online judge');
        }
        responseHandler.ok(res, problem);
    } catch (error) {
        console.log(error);
        if(error.message==='Invalid Url'){
           return responseHandler.badRequest(res, error.message);
        }
        responseHandler.error(res);
    }
});

export default problemRouter;
