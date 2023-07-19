/* eslint-disable max-len */
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { createProblem, readProblem } from '../../database/queries/problem_query.js';
import extractTitle from '../../lib/extractTitle.js';
import getCurrentDateTime from '../../lib/getCurrentDateTime.js';

/**
 * Parses a problem from a specific URL.
 * @param {string} url - The URL of the problem.
 * @param {string} judge - The main judge of the problem.
 * @param {string} problemID - The ID of the problem.
 * @returns {Promise<object>} A promise that resolves to the parsed problem object.
 * @throws {Error} If there is an error parsing the problem or the URL is invalid.
 */
async function parseProblem(url, judge, problemID) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    if ((await page.title()) === 'Timus Online Judge') {
        console.log('Url redirect to another page');
        throw new Error('Invalid Url');
    }
    // grab the div element which contains the problem statement
    const problemStatementHTML = await page.$eval(
        '.problem_content',
        (el) => el.parentElement.innerHTML
    );

    // load the div element in cheerio
    const $ = cheerio.load(problemStatementHTML);

    // Modify the src attribute for each <img> tag
    const imgTags = $('img');
    imgTags.each((index, element) => {
        const src = $(element).attr('src');
        const modifiedSrc = `https://acm.timus.ru${src}`;
        $(element).attr('src', modifiedSrc);
    });

    // parsing the problem title
    const title = extractTitle(judge, $('.problem_title').text().trim());

    // parsing time and memory limit
    const str = $('div.problem_limits').text().trim();
    const timeLimit = str.substring(str.indexOf(':') + 2, str.indexOf('Memory'));
    const memoryLimit = `${str.substring(
        str.indexOf('Memory limit: ') + 14,
        str.lastIndexOf(' MB')
    )} megabytes`;

    // parsing full problem statement
    const problemStatement = [];
    const notes = [];
    let author = '';

    const problemSection = $('#problem_text');
    let problemStatementFlag = true;
    let noteFlag = false;
    problemSection.children().each((index, element) => {
        const htmlElement = $.html(element);

        if ($(htmlElement).hasClass('problem_source')) {
            author = $(htmlElement)
                .text()
                .trim()
                .split('Problem ')
                .filter((item) => item !== '');
            return false;
        }

        if ($(htmlElement).text() === 'Sample' || $(htmlElement).text() === 'Samples') {
            problemStatementFlag = false;
        }
        if (problemStatementFlag) {
            problemStatement.push(htmlElement);
        }

        if (noteFlag) {
            notes.push(htmlElement);
        }
        if ($(htmlElement).text() === 'Note' || $(htmlElement).text() === 'Notes') {
            noteFlag = true;
        }
    });

    // parsing sample input and output
    const inputs = [];
    const outputs = [];
    const totalPreTag = $('table.sample');
    const $2 = cheerio.load(totalPreTag.html());

    $2('pre').each((index, element) => {
        if (index % 2 === 0) inputs.push($.html(element));
        else outputs.push($.html(element));
    });

    // parsing problem tags
    const tags = [];
    $('.problem_links')
        .prev()
        .find('a')
        .each((index, element) => {
            const text = $(element).text();
            tags.push(text);
        });
    tags.pop();

    // parsing difficulty
    const difficulty = $('div.problem_links span').text().trim().replace('Difficulty: ', '');

    // get the current date and time
    const currentDateTime = getCurrentDateTime();

    const problem = {
        judge,
        problemID,
        title,
        timeLimit,
        memoryLimit,
        problemStatement,
        sampleTestCase: {
            inputs,
            outputs,
        },
        notes,
        tags,
        difficulty,
        source: url,
        author,
        parsedAt: currentDateTime,
    };
    return problem;
}

/**
 * Extracts the problem ID from the Timus Online Judge URL.
 * @param {string} url - The Timus Online Judge URL.
 * @returns {string} The extracted problem ID.
 * @throws {Error} If the URL is invalid or the problem ID cannot be extracted.
 */
function extractProblemID(url) {
    const pattern = /num=(\d+)/;
    const match = url.match(pattern);
    if (!match) {
        console.log('Error occurred during extract problemID');
        throw new Error('Invalid Url');
    }
    return match[1];
}
/**
 * Parses a problem from Timus Online Judge.
 * @param {string} judge - The judge name.
 * @param {string} url - The URL of the problem.
 * @returns {Promise<object>} A promise that resolves to the parsed problem object.
 * @throws {Error} If there is an error parsing the problem or the URL is invalid.
 */
async function parseTimusProblem(judge, url) {
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

export default parseTimusProblem;
