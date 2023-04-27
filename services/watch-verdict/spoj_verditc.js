/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');

function sleep(ms) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatus(html, submissionID, username) {
    const $ = cheerio.load(html);
    const tr = $(`tr:has(a:contains(${submissionID}))`);
    if (tr.length) {
        const status = {}; // object to store submission status
        status.submissionId = submissionID;
        status.timestamp = tr.find('.status_sm span').text().trim();
        status.username = username;
        const td = $('td.sproblem');
        const title = td.find('a').attr('title');
        status.problem = `${tr.find('.sproblem a').text().trim()} - (${title})`;
        status.language = tr.find('.slang span').text().trim();
        status.verdict = tr.find('.statusres').text().trim().split('\n')[0];
        status.time = tr.find('.stime a').text().trim();
        status.memory = tr.find('.smemory').text().trim();
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
    return status;
}

module.exports = watchSPOJVerdict;
