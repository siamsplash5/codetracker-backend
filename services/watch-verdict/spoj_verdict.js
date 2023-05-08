/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatus(html, spojSubmissionID, botUsername) {
    const $ = cheerio.load(html);
    const tr = $(`tr:has(a:contains(${spojSubmissionID}))`);
    if (tr.length) {
        const submissionID = spojSubmissionID;
        const timestamp = tr.find('.status_sm span').text().trim();
        const td = $('td.sproblem');
        const title = td.find('a').attr('title');
        const problemName = `${tr.find('.sproblem a').text().trim()} - (${title})`;
        const language = tr.find('.slang span').text().trim();
        const verdict = tr.find('.statusres').text().trim().split('\n')[0];
        const time = tr.find('.stime a').text().trim();
        const memory = tr.find('.smemory').text().trim();

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

async function watchSPOJVerdict(submissionInfo) {
    const { superagent, username, submissionID } = submissionInfo;
    const watchUrl = `https://www.spoj.com/status/${username}/`;
    let status;
    for (let i = 0; i < 10000; i += 1) {
        const html = (await superagent.get(watchUrl)).text;
        status = getStatus(html, submissionID, username);
        console.log(status.verdict);
        if (
            (status.verdict.includes('running') || status.verdict.includes('compiling..')) === false
        ) {
            break;
        }
        await sleep(2000);
    }
    console.log(status);
    return status;
}

module.exports = watchSPOJVerdict;
