/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { readProblem, createProblem } = require('../../database/queries/problem_query');
const getCurrentDateTime = require('../../lib/getCurrentDateTime');

async function parseProblem(url, problemID) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    if ((await page.title()) === '404 Not Found') {
        throw new Error('Invalid Url');
    }
    // grab the div element which contain the problem statement
    const problemStatementHTML = await page.$eval('body', (el) => el.innerHTML);

    // load the div element in cheerio
    const $ = cheerio.load(problemStatementHTML);

    // parsing the problem title
    let title = $('h2#problem-name').text().trim();
    title = title.replace(`${problemID} - `, '');
    const problemBody = $('#problem-body');

    // parsing full problem statement
    let problemFullBody = '';
    problemBody
        .find('h3:contains("Example")')
        .prevAll()
        .each((index, element) => {
            problemFullBody = `${$(element)}\n${problemFullBody}`;
        });

    // parsing sample input and output
    let inputAndOutput = '';
    problemBody
        .find('h3:contains("Example")')
        .nextAll()
        .each((index, element) => {
            inputAndOutput += `${$(element)}\n`;
        });

    // parsing author info
    const author = $('.probleminfo').find('td').eq(1).text();

    // parsing time, source and memory limit
    const timeLimit = $('.probleminfo')
        .find('td')
        .eq(5)
        .text()
        .replace('\n\t\t\t', '')
        .replace(/(\d+)s/g, '$1 second');
    const sourceLimit = $('.probleminfo')
        .find('td')
        .eq(7)
        .text()
        .replace(/(\d+)B/, '$1 bytes');
    const memoryLimit = $('.probleminfo').find('td').eq(9).text().replace('MB', ' megabytes');

    // parsing current Date and Time
    const currentDateTime = getCurrentDateTime();

    const problem = {
        problemID,
        title,
        timeLimit,
        memoryLimit,
        sourceLimit,
        problemStatement: {
            problemFullBody,
        },
        sampleTestCase: {
            inputAndOutput,
        },
        source: url,
        author,
        parsedAt: currentDateTime,
    };
    return problem;
}

function extractProblemID(url) {
    let problemID = url.replace('https://www.spoj.com/problems/', '');
    if (problemID.slice(-1) === '/') problemID = problemID.slice(0, -1);
    return problemID;
}

async function parseSpojProblem(judge, url) {
    try {
        const problemID = extractProblemID(url);
        let problem = await readProblem(judge, problemID);
        if (problem === 'not found') {
            problem = await parseProblem(url, problemID);
            await createProblem(judge, problem);
        }
        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = parseSpojProblem;
