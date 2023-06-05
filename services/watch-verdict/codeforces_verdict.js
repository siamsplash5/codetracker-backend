/* eslint-disable no-promise-executor-return */
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
 * @param {string} cfSubmissionID - Codeforces submission ID.
 * @returns {Object|null} - Submission status if found, otherwise null.
 */
function getStatus(html, cfSubmissionID) {
    const $ = cheerio.load(html);
    const tr = $(`tr[data-submission-id=${cfSubmissionID}]`);

    if (tr.length) {
        const submissionID = tr.find('.id-cell a').text().trim();
        const timestamp = tr.find('.format-time').text().trim();
        const botUsername = tr.find('.status-party-cell a').text().trim();
        const problemName = tr.find('.status-small a').text().trim();
        const language = tr.find(':nth-child(5)').text().trim();
        const verdict = tr.find('.submissionVerdictWrapper').text().trim();
        const time = tr.find('.time-consumed-cell').text().trim();
        const memory = tr.find('.memory-consumed-cell').text().trim();

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

    return null;
}

/**
 * Retrieves the status of a Codeforces submission by watching for the verdict.
 *
 * @param {Object} submissionInfo - Submission information.
 * @param {Object} submissionInfo.agent - Superagent instance for making HTTP requests.
 * @param {string} submissionInfo.contestID - Contest ID.
 * @param {string} submissionInfo.submissionID - Submission ID.
 * @returns {Promise<Object>} - Submission status.
 * @throws {Error} - If the submission status cannot be retrieved.
 */
async function watchCodeforcesVerdict(submissionInfo) {
    const { agent, contestID, submissionID } = submissionInfo;
    const watchUrl = `https://codeforces.com/contest/${contestID}/my`;

    try {
        let status;

        for (let i = 0; i < 20; i += 1) {
            const { text } = await agent.get(watchUrl);
            status = getStatus(text, submissionID);
            console.log(status.verdict);

            if (
                !(
                    status.verdict === '' ||
                    status.verdict.includes('Running') ||
                    status.verdict.includes('queue')
                )
            ) {
                break;
            }

            await sleep(3000);
        }

        console.log(status);
        return status;
    } catch (error) {
        throw new Error(error.message || 'Failed to watch Codeforces verdict');
    }
}

export default watchCodeforcesVerdict;
