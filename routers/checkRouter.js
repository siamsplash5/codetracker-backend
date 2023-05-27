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
        const cfRegex = /^https?:\/\/codeforces\.com\/[^\s]+$/;
        const timusRegex = /^https?:\/\/acm\.timus\.ru\/problem.aspx\?(space=[^\s]+&)?num=[^\s]+$/;
        const atcoderRegex = /^https?:\/\/atcoder\.jp\/contests\/[^\s]+\/tasks\/[^\s]+$/;
        const spojRegex = /^https?:\/\/(www\.)?spoj\.com\/problems\/\w+\/?$/i;

        if(spojRegex.test(problemUrl)){
            responseHandler.ok(res, {
                status: 200,
                message: "matched"
            })
        }
        else{
            responseHandler.ok(res, {
                status: 400,
                message: "not matched"
            })
        }
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
