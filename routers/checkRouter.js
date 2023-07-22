import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();

checkRouter.get('/', async (req, res) => {
    try {
        responseHandler.ok(res, 'checked');
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
