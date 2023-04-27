/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatus(html, submissionID) {
    const $ = cheerio.load(html);
    const tr = $(`tr[data-submission-id=${submissionID}]`);
    if (tr.length) {
        const status = {}; // object to store submission status
        status.submissionId = tr.find('.id-cell a').text().trim();
        status.timestamp = tr.find('.format-time').text().trim();
        status.username = tr.find('.status-party-cell a').text().trim();
        status.problem = tr.find('.status-small a').text().trim();
        status.language = tr.find(':nth-child(5)').text().trim();
        status.verdict = tr.find('.submissionVerdictWrapper').text().trim();
        status.time = tr.find('.time-consumed-cell').text().trim();
        status.memory = tr.find('.memory-consumed-cell').text().trim();
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
        if ((status.verdict.includes('Running') || status.verdict.includes('queue')) === false) {
            break;
        }
        await sleep(3000);
    }
    return status;
}

module.exports = watchCodeforcesVerdict;
