/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { createProblem, readProblem } from '../../database/queries/problem_query.js';
import extractTitle from '../../lib/extractTitle.js';
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
    const browser = await puppeteer.launch({ headless: 'new' });
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

    // Modify the src attribute for each <img> tag
    const imgTags = $('img');
    imgTags.each((index, element) => {
        const src = $(element).attr('src');
        const modifiedSrc = `https://www.spoj.com/${src}`;
        $(element).attr('src', modifiedSrc);
    });

    // Parsing the problem title
    const title = extractTitle(judge, $('h2#problem-name').text().trim());

    // parsing problem statement with sample input output and notes
    const problemStatement = $('#problem-body').html();

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

    // parse the problem tag
    let tags = $('div#problem-tags a').text();
    if (tags.length) {
        if (tags.startsWith('#')) {
            tags = tags.substring(1);
        }

        // Split the string into an array of words using '#' as the delimiter
        tags = tags.split('#');
    }

    // Parsing current date and time
    const currentDateTime = getCurrentDateTime();

    const problem = {
        judge,
        problemID,
        title,
        timeLimit,
        memoryLimit,
        sourceLimit,
        problemStatement,
        tags,
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
