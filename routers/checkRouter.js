import axios from 'axios';
import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();

function findUniqueElements(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

checkRouter.get('/', async (req, res) => {
    try {
        const { data } = await axios.get(
            'https://kenkoooo.com/atcoder/atcoder-api/results?user=siamsplash5'
        );
        let arr = [];
        data.forEach((value, index) => {
            if (value.result === 'AC') {
                arr.push(value.problem_id);
            }
        });
        arr = findUniqueElements(arr);
        responseHandler.ok(res, arr.length);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
