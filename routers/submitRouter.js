import express from 'express';
import updateSubmission from '../database/queries/submission_query.js';
import responseHandler from '../handlers/response.handler.js';
import dateFormatter from '../lib/dateFormatter.js';
import atcoderSubmit from '../services/submit/atcoder_submit.js';
import codeforcesSubmit from '../services/submit/codeforces_submit.js';
import spojSubmit from '../services/submit/spoj_submit.js';
import timusSubmit from '../services/submit/timus_submit.js';
import watchAtcoderVerdict from '../services/watch-verdict/atcoder_verdict.js';
import watchCodeforcesVerdict from '../services/watch-verdict/codeforces_verdict.js';
import watchSPOJVerdict from '../services/watch-verdict/spoj_verdict.js';
import watchTimusVerdict from '../services/watch-verdict/timus_verdict.js';

const submitRouter = express.Router();

submitRouter.post('/', async (req, res) => {
    try {
        const submitInfo = req.body;
        const { judge, problemID, sourceCode } = submitInfo;
        const { username, userDatabaseID } = req;

        let status;
        if (judge === 'Atcoder') {
            const watchInfo = await atcoderSubmit(submitInfo);
            console.log('Submitted');
            status = await watchAtcoderVerdict(watchInfo);
        } else if (judge === 'Codeforces') {
            const watchInfo = await codeforcesSubmit(submitInfo);
            console.log('Submitted');
            status = await watchCodeforcesVerdict(watchInfo);
        } else if (judge === 'Spoj') {
            const watchInfo = await spojSubmit(submitInfo);
            console.log('Submitted');
            status = await watchSPOJVerdict(watchInfo);
        } else if (judge === 'Timus') {
            const watchInfo = await timusSubmit(submitInfo);
            console.log('Submitted');
            status = await watchTimusVerdict(watchInfo);
        }

        let myContestID = 0;
        if (req.contestID !== undefined && req.contestID !== null) {
            myContestID = req.contestID;
        }
        const { submissionID, botUsername, problemName, language, verdict, time, memory } = status;
        const { convertedDate, convertedTime } = dateFormatter(Date.now());

        const submittedSolution = {
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
            submitDate: convertedDate,
            submitTime: convertedTime,
        };

        await updateSubmission(userDatabaseID, submittedSolution);

        responseHandler.ok(res, submittedSolution);
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

export default submitRouter;
