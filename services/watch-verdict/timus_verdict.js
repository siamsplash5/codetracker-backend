/* eslint-disable operator-linebreak */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatus(html, submissionID) {
    const $ = cheerio.load(html);
    const tbody = $(`table.status:has(tr:contains(${submissionID}))`);
    const $2 = cheerio.load(tbody.toString());
    const tr = $2(`tr:has(td:contains(${submissionID}))`);

    if (tr.length) {
        const status = {}; // object to store submission status
        status.submissionId = submissionID;
        status.timestamp = tr.find('.date nobr').text().trim();
        status.username = tr.find('.coder a').text().trim();
        status.problem = tr.find('.problem a').text().trim();
        status.language = tr.find('.language').text().trim();
        const verdict = tr.find(':nth-child(6)').text().trim().split('\n')[0];
        if (verdict === 'Accepted' || verdict === 'Running' || verdict === 'Compiling') {
            status.verdict = verdict;
        } else {
            const test = tr.find('.test').text().trim();
            status.verdict = `${verdict} on test case ${test}`;
        }

        status.time = `${tr.find('.runtime').text().trim()}s`;
        status.memory = tr.find('.memory').text().trim();
        return status;
    }
    throw new Error('Invalid submission status');
}
async function watchTimusVerdict(submissionInfo) {
    const { superagent, submissionID } = submissionInfo;
    const watchUrl = 'https://acm.timus.ru/status.aspx?space=1&count=100';
    let status;
    for (let i = 0; i < 10000; i += 1) {
        const html = (await superagent.get(watchUrl)).text;
        status = getStatus(html, submissionID);
        console.log(status.verdict);
        if (
            (status.verdict.includes('Running') || status.verdict.includes('Compiling')) === false
        ) {
            break;
        }
        await sleep(1000);
    }
    console.log(status);
    return status;
}

module.exports = watchTimusVerdict;
