import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

function extractTitle(input) {
    const separatorIndex = input.indexOf('. ');
    if (separatorIndex !== -1) {
        return input.substring(separatorIndex + 2);
    }
    return input;
}
checkRouter.post('/', (req, res) => {
    try {
        const { title } = req.body;
        const data = extractTitle(title);
        responseHandler.ok(res, data);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
