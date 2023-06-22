import express from 'express';
import Submission from '../database/models/Submission.js';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

checkRouter.post('/', async (req, res) => {
    try {
        // Update all documents in the collection
        await Submission.updateMany(
            {},
            {
                $unset: { contestID: 0 },
            }
        );
        res.send('done');
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
