/*

Title: Timus Submission System
Description: Submit to the acm.timus.ru by sending post request to their server.
Receive: problemIndex (ex: 1000), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const cheerio = require('cheerio');
const randomStringGenerator = require('../../lib/randomStringGenerator');
const { decryptPassword } = require('../../lib/encryption');
const bot = require('../../database/queries/bot_auth_query');

/**
 * Extracts the submission ID from the HTML response.
 *
 * @param {string} html - HTML content.
 * @returns {string} - Submission ID.
 * @throws {Error} - If the submission ID is not found.
 */
function getSubmissionID(html) {
    try {
        const $ = cheerio.load(html);
        const td = $('td.id').first();
        if (td !== null) {
            return td.text();
        }
        throw new Error('Submission ID not found');
    } catch (error) {
        throw new Error(error.message || 'Failed to extract submission ID');
    }
}

/**
 * Submits a solution to the Timus Online Judge.
 *
 * @param {Object} info - Submission information.
 * @param {string} info.problemIndex - Problem index.
 * @param {string} info.langID - Language ID.
 * @param {string} info.sourceCode - Source code of the solution.
 * @returns {Promise<Object>} - Submission details.
 * @throws {Error} - If the submission fails.
 */
async function timusSubmit(info) {
    try {
        const { problemIndex, langID, sourceCode } = info;
        const submitUrl = 'https://acm.timus.ru/submit.aspx?space=1';
        const formToken = randomStringGenerator({
            lowerCase: true,
            upperCase: true,
            numbers: true,
            specialChar: false,
            stringLen: 16,
        });

        const data = await bot.readInfo('bot_user_1', 'timus');
        const judgeID = decryptPassword(data.timusCredentials.judgeID, process.env.SECRET_KEY);

        const submitData = {
            Action: 'submit',
            SpaceID: 1,
            JudgeID: judgeID,
            Language: langID,
            ProblemNum: problemIndex,
            Source: sourceCode,
            SourceFile: '(binary)',
        };

        const res = await superagent
            .post(submitUrl)
            .field(submitData)
            .set(
                'content-type',
                `multipart/form-data; boundary=----WebKitFormBoundary${formToken}`
            );

        if (![200, 301, 302].includes(res.status)) {
            throw new Error(`Timus submit failed, status code ${res.status}`);
        }

        const submissionID = getSubmissionID(res.text);

        return { superagent, submissionID };
    } catch (error) {
        throw new Error(error.message || 'Timus submit failed');
    }
}

module.exports = timusSubmit;
