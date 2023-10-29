import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();

checkRouter.get('/uptime-robot', async (req, res) => {
    try {
        console.log('UptimeRobot');
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
