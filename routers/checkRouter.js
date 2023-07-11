import express from 'express';
import { Contest } from '../database/models/Contest.js';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

checkRouter.post('/', async (req, res) => {
    try {
        await Contest.updateMany({ owner: 'siamsplash6' }, { owner: 'siamsplash5' });
        res.send('Done');
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
