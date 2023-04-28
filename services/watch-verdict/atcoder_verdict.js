/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function getStatus(html, contestID, submissionID) {
    const $ = cheerio.load(html);
    const table = $('table.table-striped').eq(0);
    const td = table
        .find('td')
        .map((index, element) => $(element).text().trim())
        .get();

    const status = {
        submissionId: submissionID,
        timestamp: td[0],
        username: td[2],
        problem: `${contestID.toUpperCase()} - ${td[1]}`,
        language: td[3],
        verdict: td[6].includes('/') ? td[6] : verdictNames(td[6]),
    };
    if (td.length === 9) {
        status.time = td[7];
        status.memeory = td[8];
    }

    return status;
}

async function watchAtcoderVerdict(watchInfo) {
    const { superagent, contestID, submissionID } = watchInfo;
    const watchUrl = `https://atcoder.jp/contests/${contestID}/submissions/${submissionID}`;
    let status;
    for (let i = 0; i < 20; i += 1) {
        const html = (await superagent.get(watchUrl)).text;
        status = getStatus(html, contestID, submissionID);
        console.log(status);
        if (status.memeory !== undefined) {
            break;
        }
        await sleep(2000);
    }

    return status;
}

module.exports = watchAtcoderVerdict;
