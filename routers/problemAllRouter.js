import express from 'express';
import Atcoder from '../database/models/AtcoderProblem.js';
import Codeforces from '../database/models/CodeforcesProblem.js';
import Spoj from '../database/models/SpojProblem.js';
import Timus from '../database/models/TimusProblem.js';
import responseHandler from '../handlers/response.handler.js';

const problemAllRouter = express.Router();

/**
 * GET /problemAllRouter
 * Return all problems from the database
 */
problemAllRouter.get('/', async (req, res) => {
    try {
        const [atcoderProblems, codeforcesProblems, spojProblems, timusProblems] =
            await Promise.all([
                Atcoder.find({}, 'problems'),
                Codeforces.find({}, 'problems'),
                Spoj.find({}, 'problems'),
                Timus.find({}, 'problems'),
            ]);

        const problemList = []
            .concat(...atcoderProblems.map((volumeObject) => volumeObject.problems))
            .concat(...codeforcesProblems.map((volumeObject) => volumeObject.problems))
            .concat(...spojProblems.map((volumeObject) => volumeObject.problems))
            .concat(...timusProblems.map((volumeObject) => volumeObject.problems));

        responseHandler.ok(res, problemList);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default problemAllRouter;
