/* eslint-disable max-len */
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

/**
 * Handle the submission of a problem solution.
 * @route POST /submit
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body object.
 * @param {string} req.body.judge - The judge name for the submission (e.g., "Atcoder", "Codeforces", "Spoj", "Timus").
 * @param {string} req.body.problemID - The Problem ID of the problem being submitted.
 * @param {string} req.body.problemName - The name of the problem being submitted.
 * @param {string} req.body.langID - The language value of the submitted solution.
 * @param {string} req.body.sourceCode - The source code of the problem solution.
 * @param {string} req.username - The username associated with the request (comes from middleware)
 * @param {string} req.userDatabaseID - The database ID associated with the requesting user. (comes from middleware)
 * @param {number|null} req.contestID - The ID of the virtual judge contest, if applicable. Otherwise, it can be null.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves once the submission is processed.
 * @throws {Error} If an error occurs during the submission process.
 */

submitRouter.post('/', async (req, res) => {
    try {
        const submitInfo = req.body;
        const { judge, problemID, problemName, sourceCode, vjContest } = submitInfo;
        const { username, userDatabaseID } = req;
        const currentTimeInMS = Date.now();
        const { convertedDate, convertedTime } = dateFormatter(currentTimeInMS);

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

        const { submissionID, botUsername, language, verdict, time, memory } = status;

        const submittedSolution = {
            realJudgesSubmissionID: submissionID,
            submittedBy: username,
            botWhoSubmitted: botUsername,
            judge,
            problemID,
            problemName,
            sourceCode: String.raw`${sourceCode}`,
            verdict,
            language,
            time,
            memory,
            submitDate: convertedDate,
            submitTime: convertedTime,
            vjContest: vjContest || null,
        };

        await updateSubmission(userDatabaseID, submittedSolution);

        responseHandler.ok(res, submittedSolution);
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
});

export default submitRouter;
