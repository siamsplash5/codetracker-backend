/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function watchCodeforcesVerdict(submissionInfo) {
    const { superagent, contestID, submissionID } = submissionInfo;
    const watchUrl = `https://codeforces.com/contest/${contestID}/my`;
    let status;
    for (let i = 0; i < 10000; i += 1) {
        const html = (await superagent.get(watchUrl)).text;
        status = getStatus(html, submissionID);
        console.log(status.verdict);
        if (
            (status.verdict === '' ||
                status.verdict.includes('Running') ||
                status.verdict.includes('queue')) === false
        ) {
            break;
        }
        await sleep(3000);
    }
    console.log(status);
    return status;
}

module.exports = watchCodeforcesVerdict;
