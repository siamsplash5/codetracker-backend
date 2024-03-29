/* eslint-disable prettier/prettier */
/*

Title: SPOJ Submission System
Description: Submit to the spoj.com by sending post request to their server.
Receive: problemIndex (ex: FIBEZ), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
import cheerio from 'cheerio';
import superagent from 'superagent';
import { readInfo } from '../../database/queries/bot_auth_query.js';
import randomStringGenerator from '../../lib/randomStringGenerator.js';
import spojLogin from '../bot_login/spoj_login.js';

const agent = superagent.agent();

/**
 * Extracts the submission ID from the HTML response.
 * @param {string} html - HTML content.
 * @returns {string} - Submission ID.
 * @throws {Error} - If the submission ID is not found.
 */
function getSubmissionID(html) {
    try {
        const $ = cheerio.load(html);
        const input = $('input[name="newSubmissionId"]');
        const submissionID = input.attr('value');
        if (submissionID !== null) {
            return submissionID;
        }
        throw new Error('Submission ID not found');
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Checks if the user is logged in to SPOJ.
 * @param {string} username - User's username.
 * @returns {Promise<boolean>} - Whether the user is logged in or not.
 * @throws {Error} - If there is a connection error or login status check fails.
 */
async function isLogin(username) {
    const url = 'https://www.spoj.com/';
    const res = await agent.get(url);
    if (res.status !== 200) {
        throw new Error('SPOJ Connection Error');
    }
    return res.text.includes(username);
}

/**
 * Submits a solution to SPOJ.
 *
 * @param {Object} info - Submission information.
 * @param {string} info.problemID - Problem index.
 * @param {string} info.langID - Language ID.
 * @param {string} info.sourceCode - Source code of the solution.
 * @returns {Promise<Object>} - Submission details.
 * @throws {Error} - If the submission fails.
 */

async function spojSubmit(info) {
    try {
        const { problemID, langID, sourceCode } = info;
        const submitUrl = 'https://www.spoj.com/submit/complete/';
        const formToken = randomStringGenerator({
            lowerCase: true,
            upperCase: true,
            numbers: true,
            specialChar: false,
            stringLen: 16,
        });

        let botInfo = await readInfo('bot_user_1', 'spoj');
        const { username, password, spojCredentials } = botInfo;

         // If cookie exists, set the cookie and check if it is expired or not
        if (spojCredentials.cookie.length >= 2) {
            agent.jar.setCookies(spojCredentials.cookie);
        }

        // check user login or not
        if (!(await isLogin(username))) {
            await spojLogin(username, password);
            botInfo = await readInfo(username, 'spoj');
        }

        const { cookie } = botInfo.spojCredentials;
        agent.jar.setCookies(cookie);

        const submitData = {
            subm_file: '(binary)',
            file: sourceCode,
            lang: langID,
            problemcode: problemID,
            submit: 'Submit!',
        };
        const res = await agent
            .post(submitUrl)
            .field(submitData)
            .set(
                'content-type',
                `multipart/form-data; boundary=----WebKitFormBoundary${formToken}`,
            );

        if (![200, 301, 302].includes(res.status)) {
            throw new Error(`SPOJ submit failed, status code ${res.status}`);
        }
        const submissionID = getSubmissionID(res.text);
        return { agent, username, submissionID };
    } catch (error) {
        console.error('An error occurred during Spoj submission:', error);
        throw new Error(error);
    }
}

export default spojSubmit;
