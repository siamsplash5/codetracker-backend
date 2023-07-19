/* eslint-disable max-len */
import cheerio from 'cheerio';
import puppeteer from 'puppeteer-core';
import { createProblem, readProblem } from '../../database/queries/problem_query.js';
import extractTitle from '../../lib/extractTitle.js';
import getCurrentDateTime from '../../lib/getCurrentDateTime.js';
/**
 * Parses a problem from the given URL and returns the parsed problem object.
 * @param {string} url - The URL of the problem.
 * @param {string} judge - The main judge of the problem.
 * @param {string} problemID - The ID of the problem.
 * @returns {Promise<object>} The parsed problem object.
 * @throws {Error} If the URL is invalid or if there is an error during parsing.
 */
async function parseProblem(url, judge, problemID) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });

    if ((await page.title()) === '404 Not Found - AtCoder') {
        console.log('Url redirect to another page');
        throw new Error('Invalid Url');
    }

    // Grab problem statement from the webpage
    const problemStatementHTML = await page.$eval(
        '#task-statement',
        (el) => el.parentElement.innerHTML
    );
    // Load the problem statement HTML to cheerio
    const $ = cheerio.load(problemStatementHTML);

    // Parse the title of the problem
    const title = extractTitle(judge, $('span.h2').text().trim().replace('\n\t\t\tEditorial', ''));

    // Parsing the score of the problem
    const score = $('span.lang-en p').find('mn').eq(0).text();

    // Parsing the time and memory limit of the problem
    const timeAndMemoryLimit = $('p').eq(0).text().trim();
    let timeLimit = timeAndMemoryLimit.match(/Time Limit: (\d+) sec/)[1];
    let memoryLimit = timeAndMemoryLimit.match(/Memory Limit: (\d+) MB/)[1];

    // checking the plurality of timelimit
    timeLimit = timeLimit === '1' ? `${timeLimit} second` : `${timeLimit} seconds`;
    memoryLimit = `${memoryLimit} megabytes`;

    // check language switching button hidden or not
    const spanElement = $('#task-lang-btn');
    const isHidden = spanElement.attr('style') === 'display: none;';

    // Parse the problem statement, sample inputs and outputs and relevant notes
    const len = $('.part').length;

    const problemStatement = [];
    const inputs = [];
    const outputs = [];
    const notes = [];
    let breakPoint = 0;

    if (isHidden) {
        for (let i = 0; i < len; i += 1) {
            let element = $('div.part').eq(i).html();
            const divElement = $(element);

            if (divElement.length > 0 && divElement.text().trim().startsWith('Input')) {
                console.log('dukse');
                const $2 = cheerio.load(element);

                // Select the <pre> tag and find all <var> tags within it
                const preTag = $2('pre');
                const varTags = preTag.find('var');

                // Insert <br> tag after each <var> tag where there is a line break
                varTags.each((index, varTag) => {
                    const { nextSibling } = varTag;
                    if (
                        nextSibling &&
                        nextSibling.type === 'text' &&
                        /\r?\n/.test(nextSibling.data)
                    ) {
                        $2(varTag).after('<br>');
                    }
                });

                // Get the modified HTML
                element = $2.html();
            }

            if (divElement.text().startsWith('Sample Input 1')) {
                breakPoint = i;
                break;
            }
            problemStatement.push(element);
        }
        const totalPreTag = len - breakPoint;
        for (let i = 0; i < totalPreTag; i += 1) {
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
    } else {
        const startPoint = Math.ceil(len / 2);
        for (let i = 0; i < startPoint; i += 1) {
            let element = $('div.part')
                .eq(startPoint + i)
                .html();
            const divElement = $(element);
            const h3Element = divElement.find('h3');

            if (h3Element.length > 0 && h3Element.text().trim() === 'Input') {
                const $2 = cheerio.load(element);

                // Select the <pre> tag and find all <var> tags within it
                const preTag = $2('pre');
                const varTags = preTag.find('var');

                // Insert <br> tag after each <var> tag where there is a line break
                varTags.each((index, varTag) => {
                    const { nextSibling } = varTag;
                    if (
                        nextSibling &&
                        nextSibling.type === 'text' &&
                        /\r?\n/.test(nextSibling.data)
                    ) {
                        $2(varTag).after('<br>');
                    }
                });

                // Get the modified HTML
                element = $2.html();
            }

            if (h3Element.length > 0 && h3Element.text().trim() === 'Sample Input 1 Copy') {
                breakPoint = i;
                break;
            }
            problemStatement.push(element);
        }

        const totalPreTag = startPoint - breakPoint - (len % 2 === 1);
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
    }

    // Get current date and time
    const currentDateTime = getCurrentDateTime();

    const problem = {
        judge,
        problemID,
        title,
        timeLimit: `${timeLimit}`,
        memoryLimit: `${memoryLimit}`,
        problemStatement,
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
        console.log('Error occurred during extract problemID');
        throw new Error('Invalid Url');
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
            problem = await parseProblem(url, judge, problemID);
            await createProblem(judge, problem);
        }
        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export default parseAtcoderProblem;
