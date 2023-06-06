import express from 'express';
import Atcoder from '../database/models/AtcoderProblem.js';
import Codeforces from '../database/models/CodeforcesProblem.js';
import Spoj from '../database/models/SpojProblem.js';
import Timus from '../database/models/TimusProblem.js';
import responseHandler from '../handlers/response.handler.js';

const problemAllRouter = express.Router();
/**
 * GET /problemAllRouter
 * Return all problem from database
 */
problemAllRouter.get('/', async (req, res) => {
    try {
        const atcoderProblems = await Atcoder.find();
        const codeforcesProblems = await Codeforces.find();
        const spojProblems = await Spoj.find();
        const timusProblems = await Timus.find();

        const problemList = [];

        atcoderProblems.forEach((volumeObject) => {
            problemList.push(...volumeObject.problems);
        });

        codeforcesProblems.forEach((volumeObject) => {
            problemList.push(...volumeObject.problems);
        });

        spojProblems.forEach((volumeObject) => {
            problemList.push(...volumeObject.problems);
        });

        timusProblems.forEach((volumeObject) => {
            problemList.push(...volumeObject.problems);
        });

        responseHandler.ok(res, problemList);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default problemAllRouter;
