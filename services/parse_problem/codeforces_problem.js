import cheerio from 'cheerio';
import edgeChromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { createProblem, readProblem } from '../../database/queries/problem_query.js';
import extractTitle from '../../lib/extractTitle.js';
import getCurrentDateTime from '../../lib/getCurrentDateTime.js';

const LOCAL_CHROME_EXECUTABLE =
    'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe';

/**
 * Parses an AtCoder problem from the given URL and returns the parsed problem object.
 * @param {string} url - The URL of the problem.
 * @param {string} judge - The main judge of the problem.
 * @param {string} problemID - The ID of the problem.
 * @returns {Promise<object>} The parsed problem object.
 * @throws {Error} If there is an error during parsing or database operations.
 */
async function parseProblem(url, judge, problemID) {
    const executablePath = (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

    const browser = await puppeteer.launch({
        executablePath,
        args: edgeChromium.args,
        headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });

    await page.waitForTimeout(2000);

    if (page.url() !== url) {
        console.log('Url redirect to another page');
        throw new Error('Invalid Url');
    }

    const problemStatementHTML = await page.$eval('.problem-statement', (el) => el.innerHTML);
    const $ = cheerio.load(problemStatementHTML);

    const title = extractTitle(judge, $('.header .title').text().trim());
    const timeLimit = $('.header .time-limit').text().replace('time limit per test', '').trim();
    const memoryLimit = $('.header .memory-limit')
        .text()
        .replace('memory limit per test', '')
        .trim();
    const body = $('div:not([class]):not([id])').html();
    const input = $('div.input-specification').html();
    const output = $('div.output-specification').html();
    const interaction = $('div.section-title:contains("Interaction")').parent().html();

    const inputDivs = $('div.sample-test .input');
    const outputDivs = $('div.sample-test .output');
    const inputs = [];
    const outputs = [];

    inputDivs.each((index, element) => {
        const inputDivHTML = $.html(element);
        if ($('.test-example-line').length > 0) {
            const testExampleLineClass = $(inputDivHTML).find('.test-example-line');
            let inputData = '';
            testExampleLineClass.each((index2, element2) => {
                inputData += `${$(element2).text().trim()}\n`;
            });
            inputs.push(inputData);
        } else {
            const preTag = $(inputDivHTML).find('pre');
            const preTagInnerHTML = preTag.html();
            const modifiedSampleTest = preTagInnerHTML.replace(/<br>/g, '\n');
            inputs.push(modifiedSampleTest);
        }
    });

    outputDivs.each((index, element) => {
        const outputDivHTML = $.html(element);
        const preTag = $(outputDivHTML).find('pre');
        const preTagInnerHTML = preTag.html();
        const modifiedSampleTest = preTagInnerHTML.replace(/<br>/g, '\n');
        outputs.push(modifiedSampleTest);
    });

    // eslint-disable-next-line prettier/prettier
    const tags = await page.$$eval('span.tag-box', (els) => els.map((el) => el.innerHTML.toString().trim().replace(/\n\s*/g, '')));

    let rating = null;
    if (tags[tags.length - 1][0] === '*') {
        rating = tags.pop();
    }

    const currentDateTime = getCurrentDateTime();

    const problem = {
        judge,
        problemID,
        title,
        timeLimit,
        memoryLimit,
        problemStatement: {
            body,
            input,
            interaction,
            output,
        },
        sampleTestCase: {
            inputs,
            outputs,
        },
        notes: $('div.note').html(),
        tags,
        rating,
        source: url,
        parsedAt: currentDateTime,
    };
    return problem;
}

/**
 * Extracts the problem ID from the given Codeforces problem URL.
 * @param {string} url - The Codeforces problem URL.
 * @returns {string} The extracted problem ID.
 * @throws {Error} If the URL is invalid.
 */
function extractProblemID(url) {
    const regex = /\/(\d+\/)?(contest\/)?(\d+)\/problem\/(\w+)/;
    const matches = url.match(regex);
    if (matches && matches.length >= 5) {
        const contestNumber = matches[3] || '';
        const problemCode = matches[4] || '';
        return (contestNumber + problemCode).toUpperCase();
    }
    console.log('Error occurred during extract problemID');
    throw new Error('Invalid Url');
}

/**
 * Parses a Codeforces problem.
 * @param {string} judge - The judge identifier.
 * @param {string} url - The Codeforces problem URL.
 * @returns {Promise<object>} A promise that resolves to the parsed problem object.
 * @throws {Error} If there is an error parsing the problem.
 */
async function parseCodeforcesProblem(judge, url) {
    try {
        const problemID = extractProblemID(url);
        let problem = await readProblem(judge, problemID);
        if (problem === 'not found') {
            problem = await parseProblem(url, judge, problemID);
            await createProblem(judge, problem);
        }
        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export default parseCodeforcesProblem;
