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
        const info = {}; // object to store submission info
        info.submissionId = submissionID;
        info.timestamp = tr.find('.status_sm span').text().trim();
        info.username = username;
        const td = $('td.sproblem');
        const title = td.find('a').attr('title');
        info.problem = `${tr.find('.sproblem a').text().trim()} - (${title})`;
        info.language = tr.find('.slang span').text().trim();
        info.verdict = tr.find('.statusres').text().trim();
        info.time = tr.find('.stime a').text().trim();
        info.memory = tr.find('.smemory').text().trim();
        return info;
    }
    throw new Error('Invalid submission info');
}

async function watchSPOJVerdict(submissionInfo) {
    const { superagent, username, submissionID } = submissionInfo;
    const watchUrl = `https://www.spoj.com/status/${username}/`;
    let status;
    // for (let i = 0; i < 10000; i += 1) {
    const html = (await superagent.get(watchUrl)).text;
    status = getStatus(html, submissionID, username);
    //     console.log(status.verdict);
    //     if ((status.verdict.includes('Running') || status.verdict.includes('queue')) === false) {
    //         break;
    //     }
    //     await sleep(3000);
    // }
    return status;
}

module.exports = watchSPOJVerdict;
