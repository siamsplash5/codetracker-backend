import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();

checkRouter.get('/', async (req, res) => {
    try {
        const fruits = ['banana', 'apple'];
        fruits.push('orange');
        fruits.push(34);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
