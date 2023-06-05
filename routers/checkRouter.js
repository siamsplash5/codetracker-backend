import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

function extractInfo(input) {
    const regex = /^(\d+)([A-Za-z]+(\d+)?)$/;
    const matches = input.match(regex);

    if (matches) {
        const contestID = matches[1];
        const problemIndex = matches[2];
        return { contestID, problemIndex };
    }
    return null; // Return null or handle invalid inputs as per your requirement
}
checkRouter.post('/', (req, res) => {
    try {
        const { problemID } = req.body;
        const data = extractInfo(problemID);
        responseHandler.ok(res, data);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
