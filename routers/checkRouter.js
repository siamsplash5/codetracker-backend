import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */
checkRouter.post('/', (req, res) => {
    try {
        const {problemUrl} = req.body;
        //const regex = /\/(\d+\/)?(contest\/)?(\d+)\/problem\/(\w+)/;
        const regex = /\/(\d+\/)?(contest\/|problemset\/problem\/)(\d+)\/(\w+)/;
        const matches = problemUrl.match(regex);
        
        if (matches && matches.length >= 5) {
            const contestNumber = matches[3] || '';
            const problemCode = matches[4] || '';
            const problemID = (contestNumber + problemCode).toUpperCase();
            return responseHandler.ok(res, {
                problemID
            })
        }
        throw new Error('Invalid Url');
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
