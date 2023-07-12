import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

checkRouter.get('/', async (req, res) => {
    try {
        responseHandler.ok(res, 'hello from codetracker backend');
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
