/*

Title: Codeforces Submission System
Description: Submit to the codeforces.com by sending post request to their server.
Receive: contest id (ex: 1667), problemIndex (ex: a, b, c), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
import superagent from 'superagent';
import { readInfo } from '../../database/queries/bot_auth_query.js';
import { spreadCFProblemID } from '../../lib/spreadProblemID.js';
import codeforcesLogin from '../bot_login/codeforces_login.js';

const agent = superagent.agent();

/**
 * Extracts the submission ID from the HTML response.
 * @param {string} html - The HTML response from the server.
 * @returns {string} The submission ID.
 * @throws {Error} If the submission ID is not found in the HTML.
 */

function getSubmissionID(html) {
    try {
        const regex = /data-submission-id="(\d+)"/;
        const match = html.match(regex);
        if (match) {
            return match[1];
        }
        throw new Error('submission ID not found/Duplicate code');
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Checks if the user is logged in to Atcoder.
 * @param {string} username - The username to check.
 * @returns {boolean} True if the user is logged in, false otherwise.
 * @throws {Error} If there is an error connecting to Atcoder or the username is not found.
 */

async function isLogin(username) {
    const url = 'https://codeforces.com/';
    const res = await agent.get(url);
    if (!res.status === 200) {
        throw new Error('Codeforces Connection Error');
    }
    const html = res.text;
    const regex = /var handle = "(.*?)"/;
    const tmp = regex.exec(html);
    if (tmp === null || tmp.length < 2) {
        return false;
    }
    return username === tmp[1];
}

/**
 * Submits a solution to Codeforces.
 * @param {Object} info - Submission information.
 * @param {string} info.problemID - Problem ID (ContestID+ProblemIndex).
 * @param {number} info.langID - Language ID.
 * @param {string} info.sourceCode - Source code of the solution.
 * @returns {Promise<Object>} - Submission details.
 * @throws {Error} - If the submission fails.
 */

async function codeforcesSubmit(info) {
    try {
        const { problemID, langID, sourceCode } = info;
        const { contestID, problemIndex } = spreadCFProblemID(problemID);

        let botInfo = await readInfo('bot_user_1', 'codeforces');
        const { username, password, codeforcesCredentials } = botInfo;

        // If cookie exists, set the cookie and check if it is expired or not
        if (codeforcesCredentials.cookie.length > 2) {
            agent.jar.setCookies(codeforcesCredentials.cookie);
        }

        // Check if the user is logged in or not
        if (!(await isLogin(username))) {
            await codeforcesLogin(username, password);
            botInfo = await readInfo(username, 'codeforces');
        }

        const { csrf, ftaa, bfaa, cookie } = botInfo.codeforcesCredentials;
        agent.jar.setCookies(cookie);

        const submitUrl = `https://codeforces.com/contest/${contestID}/submit?csrf_token=${csrf}`;
        const submitData = {
            csrf_token: csrf,
            ftaa,
            bfaa,
            action: 'submitSolutionFormSubmitted',
            submittedProblemIndex: problemIndex,
            programTypeId: langID,
            source: sourceCode,
            tabSize: 4,
            _tta: 104,
        };

        const res = await agent
            .post(submitUrl)
            .send(submitData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (![200, 301, 302].includes(res.status)) {
            throw new Error(`Codeforces submit failed, status code ${res.status}`);
        }

        const submissionID = getSubmissionID(res.text);
        console.log(submissionID);
        return { agent, contestID, submissionID };
    } catch (error) {
        console.error('An error occurred during Codeforces submission:', error);
        throw new Error(error);
    }
}

export default codeforcesSubmit;
