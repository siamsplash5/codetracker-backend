const express = require('express');
const parseAtcoderProblem = require('../services/parse_problem/atcoder_problem');
const parseCodeforcesProblem = require('../services/parse_problem/codeforces_problem');
const parseSpojProblem = require('../services/parse_problem/spoj_problem');
const parseTimusProblem = require('../services/parse_problem/timus_problem');

const problemRouter = express.Router();

problemRouter.post('/', async (req, res) => {
    try {
        const { judge, url } = req.body;
        let problem;
        if (judge === 'atcoder') {
            problem = await parseAtcoderProblem(judge, url);
        }
        if (judge === 'codeforces') {
            problem = await parseCodeforcesProblem(judge, url);
        }
        if (judge === 'spoj') {
            problem = await parseSpojProblem(judge, url);
        }
        if (judge === 'timus') {
            problem = await parseTimusProblem(judge, url);
        }
        res.send(problem);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = problemRouter;
