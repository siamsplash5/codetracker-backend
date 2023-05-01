const express = require('express');
const atcoderSubmit = require('../services/submit/atcoder_submit');
const watchAtcoderVerdict = require('../services/watch-verdict/atcoder_verdict');
const codeforcesSubmit = require('../services/submit/codeforces_submit');
const watchCodeforcesVerdict = require('../services/watch-verdict/codeforces_verdict');
const spojSubmit = require('../services/submit/spoj_submit');
const watchSPOJVerdict = require('../services/watch-verdict/spoj_verdict');
const timusSubmit = require('../services/submit/timus_submit');
const watchTimusVerdict = require('../services/watch-verdict/timus_verdict');

const submitRouter = express.Router();

submitRouter.post('/', async (req, res) => {
    try {
        const submitInfo = req.body;
        let status;
        if (submitInfo.judge === 'atcoder') {
            const watchInfo = await atcoderSubmit(submitInfo);
            console.log('submitted');
            status = await watchAtcoderVerdict(watchInfo);
        }
        if (submitInfo.judge === 'codeforces') {
            const watchInfo = await codeforcesSubmit(submitInfo);
            console.log('submitted');
            status = await watchCodeforcesVerdict(watchInfo);
        }
        if (submitInfo.judge === 'spoj') {
            const watchInfo = await spojSubmit(submitInfo);
            console.log('submitted');
            status = await watchSPOJVerdict(watchInfo);
        }
        if (submitInfo.judge === 'timus') {
            const watchInfo = await timusSubmit(submitInfo);
            console.log('submitted');
            status = await watchTimusVerdict(watchInfo);
        }
        res.send(status);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = submitRouter;
/*

{
    judge: 'atcoder',
    contestID: 'abc032',
    problemIndex: 'c',
    langID: 4003,
    sourceCode: String.raw`code`,
}

*/
