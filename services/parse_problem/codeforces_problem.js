const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { now } = require('mongoose');

async function parseProblem(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.problem-statement');
    const problemStatementHTML = await page.$eval('.problem-statement', (el) => el.innerHTML);
    const $ = cheerio.load(problemStatementHTML);
    const problem = {};

    problem.title = $('.header .title').text().trim();
    problem.timeLimit = $('.header .time-limit').text().replace('time limit per test', '').trim();
    problem.memoryLimit = $('.header .memory-limit')
        .text()
        .replace('memory limit per test', '')
        .trim();
    problem.problemStatement = {
        bodyStatement: $('div:not([class]):not([id])').html(),
        inputStatement: $('div.input-specification').html(),
        outputStatement: $('div.output-specification').html(),
    };
    problem.sampleTestCase = [
        { input: '0', output: '5' },
        { input: '3 7', output: '9' },
    ];
    problem.notes = $('div.note').html();
    problem.tags = ['dp', 'combinatorics'];
    problem.rating = '1500';
    problem.source = url;
    problem.parsedAt = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Dhaka',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
    return problem;
}

async function parseCodeforcesProblem(problemID) {
    try {
        const matches = problemID.match(/^(\d+)([a-zA-Z0-9]+)$/);
        const contestID = matches[1];
        const problemIndex = matches[2];
        const url = `https://codeforces.com/problemset/problem/${contestID}/${problemIndex}`;
        const problem = await parseProblem(url);
        problem.problemID = problemID;

        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = parseCodeforcesProblem;
