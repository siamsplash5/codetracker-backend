/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
/* eslint-disable prefer-destructuring */
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
 * Maps the verdict code to its corresponding name.
 *
 * @param {string} verdict - Verdict code.
 * @returns {string} - Verdict name.
 */
function verdictNames(verdict) {
    const mp = {
        AC: 'Accepted',
        WA: 'Wrong Answer',
        TLE: 'Time Limit Exceeded',
        MLE: 'Memory Limit Exceeded',
        RE: 'Runtime Error',
        CE: 'Compilation Error',
        QLE: 'Queued Limit Exceeded',
        OLE: 'Output Limit Exceeded',
        IE: 'Internal Error',
        WJ: 'Waiting for Judge',
        WR: 'Waiting for Rejudge',
        Judging: 'Judging',
    };

    return mp[verdict];
}
/**
 * Retrieves the submission status from the HTML content.
 *
 * @param {string} html - HTML content.
 * @param {string} contestID - Contest ID.
 * @param {string} atcSubmissionID - Submission ID.
 * @returns {Object} - Submission status.
 */
function getStatus(html, contestID, atcSubmissionID) {
    const $ = cheerio.load(html);
    const table = $('table.table-striped').eq(0);
    const td = table
        .find('td')
        .map((index, element) => $(element).text().trim())
        .get();

    const submissionID = atcSubmissionID;
    const timestamp = td[0];
    const botUsername = td[2];
    const problemName = `${contestID.toUpperCase()} - ${td[1]}`;
    const language = td[3];
    const verdict = td[6].includes('/') ? td[6] : verdictNames(td[6]);
    let time;
    let memory;

    if (td.length === 9) {
        time = td[7];
        memory = td[8];
    }

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

/**
 * Retrieves the status of an AtCoder submission by watching for the verdict.
 *
 * @param {Object} watchInfo - Watch information.
 * @param {Object} watchInfo.superagent - Superagent instance for making HTTP requests.
 * @param {string} watchInfo.contestID - Contest ID.
 * @param {string} watchInfo.submissionID - Submission ID.
 * @returns {Promise<Object>} - Submission status.
 * @throws {Error} - If the submission status cannot be retrieved.
 */
async function watchAtcoderVerdict(watchInfo) {
    try {
        const { superagent, contestID, submissionID } = watchInfo;
        const watchUrl = `https://atcoder.jp/contests/${contestID}/submissions/${submissionID}`;
        let status;

        for (let i = 0; i < 20; i += 1) {
            const { text } = await superagent.get(watchUrl);
            status = getStatus(text, contestID, submissionID);
            console.log(status);

            if (status.memory !== undefined) {
                break;
            }

            await sleep(2000);
        }

        console.log(status);
        return status;
    } catch (error) {
        throw new Error(error.message || 'Failed to watch AtCoder verdict');
    }
}

module.exports = watchAtcoderVerdict;
