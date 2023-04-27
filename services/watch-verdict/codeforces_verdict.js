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
        const info = {}; // object to store submission info
        info.submissionId = tr.find('.id-cell a').text().trim();
        info.timestamp = tr.find('.format-time').text().trim();
        info.username = tr.find('.status-party-cell a').text().trim();
        info.problem = tr.find('.status-small a').text().trim();
        info.language = tr.find(':nth-child(5)').text().trim();
        info.verdict = tr.find('.submissionVerdictWrapper').text().trim();
        info.time = tr.find('.time-consumed-cell').text().trim();
        info.memory = tr.find('.memory-consumed-cell').text().trim();
        return info;
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
