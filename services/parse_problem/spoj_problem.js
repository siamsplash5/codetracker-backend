/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { createProblem, readProblem } from '../../database/queries/problem_query.js';
import getCurrentDateTime from '../../lib/getCurrentDateTime.js';


/**
 * Parses a problem from a given URL and problem ID.
 * @param {string} url - The URL of the problem.
 * @param {string} judge - The main judge of the problem.
 * @param {string} problemID - The ID of the problem.
 * @returns {Promise<object>} A promise that resolves to the parsed problem object.
 * @throws {Error} If there is an error parsing the problem or the URL is invalid.
 */
async function parseProblem(url, judge, problemID) {
    console.log(url);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    if ((await page.title()) === '404 Not Found') {
        console.log('Url redirect to another page');
        throw new Error('Invalid URL');
    }
    // Grab the div element which contains the problem statement
    const problemStatementHTML = await page.$eval('body', (el) => el.innerHTML);

    // Load the div element in Cheerio
    const $ = cheerio.load(problemStatementHTML);

    // Parsing the problem title
    let title = $('h2#problem-name').text().trim();
    title = title.replace(`${problemID} - `, '');
    const problemBody = $('#problem-body');

    // Parsing the full problem statement
    let problemFullBody = '';
    problemBody
        .find('h3:contains("Example")')
        .prevAll()
        .each((index, element) => {
            problemFullBody = `${$(element)}\n${problemFullBody}`;
        });

    // Parsing sample input and output
    let inputAndOutput = '';
    problemBody
        .find('h3:contains("Example")')
        .nextAll()
        .each((index, element) => {
            inputAndOutput += `${$(element)}\n`;
        });

    // Parsing author info
    const author = $('.probleminfo').find('td').eq(1).text();

    // Parsing time, source, and memory limit
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

    // Parsing current date and time
    const currentDateTime = getCurrentDateTime();

    const problem = {
        judge,
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

/**
 * Extracts the problem ID from the SPOJ problem URL.
 * @param {string} url - The URL of the problem.
 * @returns {string} The extracted problem ID.
 */
function extractProblemID(url) {
    let problemID = url.replace('https://www.spoj.com/problems/', '');
    if (problemID.slice(-1) === '/') problemID = problemID.slice(0, -1);
    return problemID;
}

/**
 * Parses a problem from SPOJ website.
 * @param {string} judge - The judge name (SPOJ).
 * @param {string} url - The URL of the problem.
 * @returns {Promise<object>} A promise that resolves to the parsed problem object.
 * @throws {Error} If there is an error parsing the problem or the URL is invalid.
 */
async function parseSpojProblem(judge, url) {
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

export default parseSpojProblem;
