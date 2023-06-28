import express from 'express';
import { updateStandings } from '../database/queries/submission_query.js';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

checkRouter.post('/', async (req, res) => {
    try {
        const { contestID, username, problemIndex, verdict, submitTime } = req.body;
        await updateStandings({ contestID, username, problemIndex, verdict, submitTime });
        res.send('Done');
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
