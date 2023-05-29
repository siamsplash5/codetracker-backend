/* eslint-disable max-len */
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { createProblem, readProblem } from '../../database/queries/problem_query.js';
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
    const browser = await puppeteer.launch({ headless: true });
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

    // parsing the problem title
    let title = $('.problem_title').text().trim();
    title = title.slice(title.indexOf('. ') + 2);

    // parsing time and memory limit
    const str = $('div.problem_limits').text().trim();
    const timeLimit = str.substring(str.indexOf(':') + 2, str.indexOf('Memory'));
    const memoryLimit = `${str.substring(
        str.indexOf('Memory limit: ') + 14,
        str.lastIndexOf(' MB')
    )} megabytes`;

    // parsing notes of input and output sections
    let note = $('h3.problem_subtitle:contains("Notes")').next().html();
    if (note) note = note.replace(/\n(?=\S)/g, '');

    // parsing full problem statement
    let count = 0;
    const bg = $('h3.problem_subtitle:contains("Background")').length;
    if (bg > 0) count -= 1;
    let background = '';
    let body = '';
    let input = '';
    let output = '';
    for (let i = 0; i <= 300; i += 1) {
        const data = $('div.problem_par')
            .eq(i)
            .html()
            .replace(/\n(?=\S)/g, '');
        if (count === -1) {
            background += `${data}\n\n`;
        } else if (count === 0) {
            body += `${data}\n\n`;
        } else if (count === 1) {
            input += `${data}\n\n`;
        } else if (count === 2) {
            output += `${data}\n\n`;
        }
        if ($('div.problem_par').eq(i).next().is('H3')) {
            count += 1;
        }
        if (count === 3) break;
    }

    // parsing sample input and output
    const inputs = [];
    const outputs = [];
    const totalPreTag = $('pre').length;
    for (let i = 0; i < totalPreTag; i += 1) {
        if (i % 2 === 0) {
            inputs.push($('pre').eq(i).html().trim());
        } else {
            outputs.push($('pre').eq(i).html().trim());
        }
    }

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

    // parsing author
    const author = $('div.problem_source')
        .text()
        .trim()
        .replace('Problem Source', '\nProblem Source');

    // get the current date and time
    const currentDateTime = getCurrentDateTime();

    const problem = {
        judge,
        problemID,
        title,
        timeLimit,
        memoryLimit,
        problemStatement: {
            background,
            body,
            input,
            output,
        },
        sampleTestCase: {
            inputs,
            outputs,
        },
        notes: note,
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
