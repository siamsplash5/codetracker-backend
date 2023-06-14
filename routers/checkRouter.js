import express from 'express';
import responseHandler from '../handlers/response.handler.js';
import extractTitle from '../lib/extractTitle.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

checkRouter.post('/', (req, res) => {
    try {
        const { judge, problemName } = req.body;
        const response = extractTitle(judge, problemName);
        res.send(response);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
