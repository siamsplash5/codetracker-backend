/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatus(html, contestID, submissionID) {
    const $ = cheerio.load(html);
    const status = {};
    status.submissionId = submissionID;
    $('table tr').each((i, row) => {
        const th = $(row).find('th').text().trim();
        const td = $(row).find('td').text().trim();
        switch (th) {
            case 'Submission Time':
                status.timestamp = td;
                break;
            case 'Task':
                status.problem = `${contestID} ${td}`;
                break;
            case 'User':
                status.username = td.split(' ')[0];
                break;
            case 'Language':
                status.language = td;
                break;
            case 'Exec Time':
                status.time = td;
                break;
            case 'Code Size':
                status.memory = td;
                break;
            case 'Status':
                status.verdict = $(row).find('.label').text().trim();
                break;
            default:
                break;
        }
    });
    return status;
}

async function watchAtcoderVerdict(watchInfo) {
    const { superagent, contestID, submissionID } = watchInfo;
    const watchUrl = `https://atcoder.jp/contests/${contestID}/submissions/${submissionID}`;
    let status;
    for (let i = 0; i < 10000; i += 1) {
        const html = (await superagent.get(watchUrl)).text;
        status = getStatus(html, contestID, submissionID);
        console.log(status);
        if (status.verdict.includes('WJ') === false) {
            break;
        }
        await sleep(2000);
    }
    console.log(status);
    return status;
}

module.exports = watchAtcoderVerdict;
