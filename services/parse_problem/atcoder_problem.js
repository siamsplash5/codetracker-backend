/* eslint-disable max-len */
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { createProblem, readProblem } from '../../database/queries/problem_query.js';
import getCurrentDateTime from '../../lib/getCurrentDateTime.js';


/**
 * Parses a problem from the given URL and returns the parsed problem object.
 * @param {string} url - The URL of the problem.
 * @param {string} problemID - The ID of the problem.
 * @returns {Promise<object>} The parsed problem object.
 * @throws {Error} If the URL is invalid or if there is an error during parsing.
 */
async function parseProblem(url, problemID) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });

    if ((await page.title()) === '404 Not Found - AtCoder') {
        throw new Error('Invalid URL');
    }

    // Grab problem statement from the webpage
    const problemStatementHTML = await page.$eval(
        '#task-statement',
        (el) => el.parentElement.innerHTML
    );

    // Load the problem statement HTML to cheerio
    const $ = cheerio.load(problemStatementHTML);

    // Parse the title of the problem
    const title = $('span.h2').text().trim().replace('\n\t\t\tEditorial', '');

    // Parsing the score of the problem
    const score = $('span.lang-en p').find('mn').eq(0).text();

    // Parsing the time and memory limit of the problem
    const timeAndMemoryLimit = $('p').eq(0).text().trim();
    let timeLimit = timeAndMemoryLimit.match(/Time Limit: (\d+) sec/)[1];
    let memoryLimit = timeAndMemoryLimit.match(/Memory Limit: (\d+) MB/)[1];

    // checking the plurality of timelimit
    timeLimit = timeLimit === '1' ? `${timeLimit} second` : `${timeLimit} seconds`;
    memoryLimit = `${memoryLimit} megabytes`;

    // Parse the problem statement
    const len = $('.part').length;
    const body = $('div.part')
        .eq(len / 2)
        .html();
    const constraint = $('div.part')
        .eq(len / 2 + 1)
        .html();
    const input = $('div.part')
        .eq(len / 2 + 2)
        .html();
    const output = $('div.part')
        .eq(len / 2 + 3)
        .html();

    // Parse the sample inputs and outputs and relevant notes
    const inputs = [];
    const outputs = [];
    const notes = [];

    const totalPreTag = len / 2 - 4;
    for (let i = totalPreTag; i <= 2 * totalPreTag - 1; i += 1) {
        const data = $(`#pre-sample${i}`).text().trim();
        if (i % 2 === 0) {
            inputs.push(data);
        } else {
            outputs.push(data);
            const notesInnerHtml = $(`#pre-sample${i}`)
                .nextAll()
                .map((index, el) => $.html(el))
                .get()

                .join('');
            if (notesInnerHtml !== null) {
                notes.push(notesInnerHtml);
            }
        }
    }

    // Get current date and time
    const currentDateTime = getCurrentDateTime();

    const problem = {
        problemID,
        title,
        timeLimit: `${timeLimit} seconds`,
        memoryLimit: `${memoryLimit} megabytes`,
        problemStatement: {
            body,
            constraint,
            input,
            output,
        },
        sampleTestCase: {
            inputs,
            outputs,
        },
        notes,
        score,
        source: url,
        parsedAt: currentDateTime,
    };
    return problem;
}

function extractProblemID(url) {
    const pattern = /\/tasks\/([a-z0-9_]+)/i;
    const match = url.match(pattern);
    if (!(match && match.length > 1)) {
        throw new Error('Invalid URL');
    }
    return match[1];
}

/**
 * Parses an AtCoder problem from the given URL and returns the parsed problem object.
 * If the problem is not found in the database, it parses the problem and creates a new entry in the database.
 * @param {string} judge - The judge (e.g., 'atcoder').
 * @param {string} url - The URL of the problem.
 * @returns {Promise<object>} The parsed problem object.
 * @throws {Error} If there is an error during parsing or database operations.
 */
async function parseAtcoderProblem(judge, url) {
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

export default parseAtcoderProblem;
