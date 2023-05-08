/* eslint-disable operator-linebreak */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}

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
async function watchTimusVerdict(submissionInfo) {
    const { superagent, timusSubmissionID } = submissionInfo;
    const watchUrl = 'https://acm.timus.ru/status.aspx?space=1&count=100';
    let status;
    for (let i = 0; i < 10000; i += 1) {
        const html = (await superagent.get(watchUrl)).text;
        status = getStatus(html, timusSubmissionID);
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
