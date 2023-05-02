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
            problem = await parseAtcoderProblem(url);
        }
        if (judge === 'codeforces') {
            problem = await parseCodeforcesProblem(url);
        }
        if (judge === 'spoj') {
            problem = await parseSpojProblem(url);
        }
        if (judge === 'timus') {
            problem = await parseTimusProblem(url);
        }
        res.send(problem);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = problemRouter;
