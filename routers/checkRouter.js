import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

checkRouter.post('/', (req, res) => {
    try {
        const { myJudge } = req.body;
        res.send(`${myJudge.charAt(0).toUpperCase()}${myJudge.slice(1)}`);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
