/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */

const cheerio = require('cheerio');

/**
 * Pauses the execution for a specified amount of time.
 *
 * @param {number} ms - Time in milliseconds.
 * @returns {Promise<void>} - A promise that resolves after the specified time.
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retrieves the submission status from the HTML content.
 *
 * @param {string} html - HTML content.
 * @param {string} timusSubmissionID - Timus submission ID.
 * @returns {Object} - Submission status.
 * @throws {Error} - If the submission status cannot be retrieved.
 */
function getStatus(html, timusSubmissionID) {
    const $ = cheerio.load(html);
    const tbody = $(`table.status:has(tr:contains(${timusSubmissionID}))`);
    const $2 = cheerio.load(tbody.toString());
    const tr = $2(`tr:has(td:contains(${timusSubmissionID}))`);

    if (tr.length) {
        const submissionID = timusSubmissionID;
        const timestamp = tr.find('.date nobr').text().trim();
        const botUsername = tr.find('.coder a').text().trim();
        const problemName = tr.find('.problem a').text().trim();
        const language = tr.find('.language').text().trim();
        let verdict = tr.find(':nth-child(6)').text().trim().split('\n')[0];

        if (!(verdict === 'Accepted' || verdict === 'Running' || verdict === 'Compiling')) {
            const test = tr.find('.test').text().trim();
            verdict = `${verdict} on test case ${test}`;
        }

        const time = `${tr.find('.runtime').text().trim()}s`;
        const memory = tr.find('.memory').text().trim();

        const status = {
            submissionID,
            timestamp,
            botUsername,
            problemName,
            language,
            verdict,
            time,
            memory,
        };

        return status;
    }

    throw new Error('Invalid submission status');
}

/**
 * Retrieves the status of a Timus submission by watching for the verdict.
 *
 * @param {Object} submissionInfo - Submission information.
 * @param {Object} submissionInfo.superagent - Superagent instance for making HTTP requests.
 * @param {string} submissionInfo.timusSubmissionID - Timus submission ID.
 * @returns {Promise<Object>} - Submission status.
 * @throws {Error} - If the submission status cannot be retrieved.
 */
async function watchTimusVerdict(submissionInfo) {
    const { superagent, timusSubmissionID } = submissionInfo;
    const watchUrl = 'https://acm.timus.ru/status.aspx?space=1&count=100';

    try {
        let status;

        for (let i = 0; i < 10000; i += 1) {
            const { text } = await superagent.get(watchUrl);
            status = getStatus(text, timusSubmissionID);
            console.log(status.verdict);

            if (!(status.verdict.includes('Running') || status.verdict.includes('Compiling'))) {
                break;
            }

            await sleep(1000);
        }

        console.log(status);
        return status;
    } catch (error) {
        throw new Error(error.message || 'Failed to watch Timus verdict');
    }
}

module.exports = watchTimusVerdict;
