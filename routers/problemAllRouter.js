import express from 'express';
import { getAllProblem } from '../database/queries/problem_query.js';
import responseHandler from '../handlers/response.handler.js';

const problemAllRouter = express.Router();

/**
 * GET /problemAllRouter
 * Return all problems from the database
 */
problemAllRouter.get('/', async (req, res) => {
    try {
        const problemList = await getAllProblem();
        problemList.sort((a, b) => b.parsedAt - a.parsedAt);
        responseHandler.ok(res, problemList);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default problemAllRouter;
