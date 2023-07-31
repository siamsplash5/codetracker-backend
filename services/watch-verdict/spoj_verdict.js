/* eslint-disable no-promise-executor-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
import cheerio from 'cheerio';

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
 * @param {string} spojSubmissionID - SPOJ submission ID.
 * @param {string} botUsername - Bot username.
 * @returns {Object} - Submission status.
 * @throws {Error} - If the submission status cannot be retrieved.
 */
function getStatus(html, spojSubmissionID, botUsername) {
    const $ = cheerio.load(html);
    const tr = $(`tr:has(a:contains(${spojSubmissionID}))`);

    if (tr.length) {
        const submissionID = spojSubmissionID;
        const timestamp = tr.find('.status_sm span').text().trim();
        const language = tr.find('.slang span').text().trim();
        const verdict = tr.find('.statusres').text().trim().split('\n')[0];
        const time = tr.find('.stime a').text().trim();
        const memory = tr.find('.smemory').text().trim();

        const status = {
            submissionID,
            timestamp,
            botUsername,
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
 * Retrieves the status of a SPOJ submission by watching for the verdict.
 *
 * @param {Object} submissionInfo - Submission information.
 * @param {Object} submissionInfo.agent - Superagent instance for making HTTP requests.
 * @param {string} submissionInfo.username - Username.
 * @param {string} submissionInfo.submissionID - Submission ID.
 * @returns {Promise<Object>} - Submission status.
 * @throws {Error} - If the submission status cannot be retrieved.
 */
async function watchSPOJVerdict(submissionInfo) {
    const { agent, username, submissionID } = submissionInfo;
    const watchUrl = `https://www.spoj.com/status/${username}/`;

    try {
        let status;

        for (let i = 0; i < 20; i += 1) {
            const { text } = await agent.get(watchUrl);
            status = getStatus(text, submissionID, username);
            console.log(status.verdict);

            if (!(status.verdict.includes('running') || status.verdict.includes('compiling..'))) {
                break;
            }

            await sleep(1000);
        }
        status.verdict = `${status.verdict.charAt(0).toUpperCase()}${status.verdict.slice(1)}`;
        console.log(status);
        return status;
    } catch (error) {
        throw new Error(error.message || 'Failed to watch SPOJ verdict');
    }
}

export default watchSPOJVerdict;
