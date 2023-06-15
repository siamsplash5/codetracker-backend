/* eslint-disable max-len */
/**
 * Title: Atcoder Submission System
 * Description: Submit to Atcoder.jp by sending a POST request to their server.
 * Receive: contest ID (ex: abc065), problemIndex (ex: a, b, c), langID, source code.
 * Return: Verdict of that problem
 * Author: Siam Ahmed
 * Date: 24-04-2023
 */

import cheerio from 'cheerio';
import superagent from 'superagent';
import { readInfo } from '../../database/queries/bot_auth_query.js';
import { spreadAtcoderProblemID } from '../../lib/spreadProblemID.js';
import atcoderLogin from '../bot_login/atcoder_login.js';

const agent = superagent.agent();
/**
 * Extracts the submission ID from the HTML response.
 * @param {string} html - The HTML response from the server.
 * @returns {string} The submission ID.
 * @throws {Error} If the submission ID is not found in the HTML.
 */
function getSubmissionID(html) {
    try {
        const $ = cheerio.load(html);
        const submissionScore = $('td.submission-score').first();
        const submissionID = submissionScore.attr('data-id');
        if (submissionID !== null) {
            return submissionID;
        }
        throw new Error('Submission ID not found');
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Checks if the user is logged in to Atcoder.
 * @param {string} username - The username to check.
 * @returns {boolean} True if the user is logged in, false otherwise.
 * @throws {Error} If there is an error connecting to Atcoder or the username is not found.
 */
async function isLogin(username) {
    try {
        const url = 'https://atcoder.jp/';
        const res = await agent.get(url);
        if (res.status !== 200) {
            throw new Error('Atcoder Connection Error');
        }
        const html = res.text;
        const regex = /var userScreenName = "(.*?)"/;
        const tmp = regex.exec(html);
        if (tmp === null || tmp.length < 2) {
            return false;
        }
        return username === tmp[1];
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Submits the received code to the Atcoder judge.
 * @param {Object} info - The submission information.
 * @param {string} info.problemID - The ID of the contest.
 * @param {string} info.langID - The ID of the programming language.
 * @param {string} info.sourceCode - The source code to submit.
 * @returns {Object} The submission result containing the agent instance, contest ID, and submission ID.
 * @throws {Error} If the submission fails or an error occurs.
 */
async function atcoderSubmit(info) {
    try {
        const { problemID, langID, sourceCode } = info;
        const { contestID, problemIndex } = spreadAtcoderProblemID(problemID);
        const submitUrl = `https://atcoder.jp/contests/${contestID}/submit`;
        let botInfo = await readInfo('bot_user_1', 'atcoder');
        const { username, password, atcoderCredentials } = botInfo;

        // If the cookie exists, set the cookie and check if it is expired
        if (atcoderCredentials.cookie.length >= 2) {
            agent.jar.setCookies(atcoderCredentials.cookie);
        }

        // Check if the user is logged in or not
        if (!(await isLogin(username))) {
            await atcoderLogin(username, password);
            botInfo = await readInfo(username, 'atcoder');
        }
        const { csrf, cookie } = botInfo.atcoderCredentials;
        agent.jar.setCookies(cookie);

        const submitData = {
            'data.TaskScreenName': `${contestID}_${problemIndex}`,
            'data.LanguageId': langID,
            sourceCode,
            csrf_token: csrf,
        };

        const res = await agent
            .post(submitUrl)
            .send(submitData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (![200, 301, 302].includes(res.status)) {
            throw new Error(`Atcoder submit failed, status code ${res.status}`);
        }

        const submissionID = getSubmissionID(res.text);
        return { agent, contestID, submissionID };
    } catch (error) {
        console.error('An error occurred during Atcoder submission');
        throw new Error(error);
    }
}

export default atcoderSubmit;
