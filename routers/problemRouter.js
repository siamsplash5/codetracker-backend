const express = require('express');
const parseAtcoderProblem = require('../services/parse_problem/atcoder_problem');
const parseCodeforcesProblem = require('../services/parse_problem/codeforces_problem');
const parseSPOJProblem = require('../services/parse_problem/spoj_problem');
const parseTimusProblem = require('../services/parse_problem/timus_problem');

const problemRouter = express.Router();

problemRouter.get('/', async (req, res) => {
    try {
        const { judge, problemID } = req.body;
        let problem;
        if (judge === 'atcoder') {
            problem = await parseAtcoderProblem(problemID);
        }
        if (judge === 'codeforces') {
            problem = await parseCodeforcesProblem(problemID);
        }
        if (judge === 'spoj') {
            problem = await parseSPOJProblem(problemID);
        }
        if (judge === 'timus') {
            problem = await parseTimusProblem(problemID);
        }
        res.send(problem);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = problemRouter;
