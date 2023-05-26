import express from 'express';
import updateSubmission from '../database/queries/submission_query.js';
import atcoderSubmit from '../services/submit/atcoder_submit.js';
import codeforcesSubmit from '../services/submit/codeforces_submit.js';
import spojSubmit from '../services/submit/spoj_submit.js';
import timusSubmit from '../services/submit/timus_submit.js';
import watchAtcoderVerdict from '../services/watch-verdict/atcoder_verdict.js';
import watchCodeforcesVerdict from '../services/watch-verdict/codeforces_verdict.js';
import watchSPOJVerdict from '../services/watch-verdict/spoj_verdict.js';
import watchTimusVerdict from '../services/watch-verdict/timus_verdict.js';
import responseHandler from '../handlers/response.handler.js'


const submitRouter = express.Router();

const createProblemID = (judge, contestID, problemIndex) => {
    if (judge === 'codeforces') return `${contestID}${problemIndex}`;
    if (judge === 'atcoder') return `${contestID}_${problemIndex}`;
    return problemIndex;
};

submitRouter.post('/', async (req, res) => {
    try {
        const submitInfo = req.body;
        const { judge, contestID, problemIndex, sourceCode } = submitInfo;
        const { username, userDatabaseID } = req;
        const problemID = createProblemID(judge, contestID, problemIndex);

        let status;
        if (submitInfo.judge === 'atcoder') {
            const watchInfo = await atcoderSubmit(submitInfo);
            console.log('Submitted');
            status = await watchAtcoderVerdict(watchInfo);
        } else if (submitInfo.judge === 'codeforces') {
            const watchInfo = await codeforcesSubmit(submitInfo);
            console.log('Submitted');
            status = await watchCodeforcesVerdict(watchInfo);
        } else if (submitInfo.judge === 'spoj') {
            const watchInfo = await spojSubmit(submitInfo);
            console.log('Submitted');
            status = await watchSPOJVerdict(watchInfo);
        } else if (submitInfo.judge === 'timus') {
            const watchInfo = await timusSubmit(submitInfo);
            console.log('Submitted');
            status = await watchTimusVerdict(watchInfo);
        }

        let myContestID = 0;
        if (req.contestID !== undefined && req.contestID !== null) {
            myContestID = req.contestID;
        }
        const { submissionID, botUsername, problemName, language, verdict, time, memory } = status;

        const submission = {
            realJudgesSubmissionID: submissionID,
            submittedBy: username,
            botWhoSubmitted: botUsername,
            judge,
            contestID: myContestID,
            problemID,
            problemName,
            sourceCode: String.raw`${sourceCode}`,
            verdict,
            language,
            time,
            memory,
        };

        await updateSubmission(userDatabaseID, submission);

        responseHandler.ok(res, status);
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

export default submitRouter;
