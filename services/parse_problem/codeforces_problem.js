const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function parseProblem(url, problemID) {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url);
    const problemStatementHTML = await page.$eval('.problem-statement', (el) => el.innerHTML);
    const $ = cheerio.load(problemStatementHTML);
    const sampleTestHTML = $('div.sample-test').html();

    const problem = {
        problemId: problemID,
        title: $('.header .title').text().trim(),
        timeLimit: $('.header .time-limit').text().replace('time limit per test', '').trim(),
        memoryLimit: $('.header .memory-limit').text().replace('memory limit per test', '').trim(),
        problemStatement: {
            bodyStatement: $('div:not([class]):not([id])').html(),
            inputStatement: $('div.input-specification').html(),
            outputStatement: $('div.output-specification').html(),
        },
        notes: $('div.note').html(),
        sampleTestCase: [
            { input: '0', output: '5' },
            { input: '3 7', output: '9' },
        ],
        tags: ['dp', 'combinatorics'],
        rating: '1500',
        source: url,
        parsedAt: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Dhaka',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        }),
    };
    return problem;
}

async function parseCodeforcesProblem(problemID) {
    try {
        const matches = problemID.match(/^(\d+)([a-zA-Z0-9]+)$/);
        const contestID = matches[1];
        const problemIndex = matches[2];
        const url = `https://codeforces.com/problemset/problem/${contestID}/${problemIndex}`;
        const problem = await parseProblem(url, problemID);

        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = parseCodeforcesProblem;
