/* eslint-disable max-len */
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { readProblem, createProblem } = require('../../database/queries/problem_query');
const getCurrentDateTime = require('../../lib/getCurrentDateTime');

async function parseProblem(url, problemID) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    if ((await page.title()) === '404 Not Found - AtCoder') {
        throw new Error('Invalid Url');
    }

    // grab problem statement from the webpage
    const problemStatementHTML = await page.$eval(
        '#task-statement',
        (el) => el.parentElement.innerHTML
    );

    // load the problem statement html to cheerio
    const $ = cheerio.load(problemStatementHTML);

    // parse the title of the problem
    const title = $('span.h2').text().trim().replace('\n\t\t\tEditorial', '');

    // parsing the score of the problem
    const score = $('span.lang-en p').find('mn').eq(0).text();

    // parsing the time and memory limit of the problem
    const timeAndMemoryLimit = $('p').eq(0).text().trim();
    let timeLimit = timeAndMemoryLimit.match(/Time Limit: (\d+) sec/)[1];
    let memoryLimit = timeAndMemoryLimit.match(/Memory Limit: (\d+) MB/)[1];
    timeLimit = timeLimit === '1' ? `${timeLimit} second` : `${timeLimit} seconds`;
    memoryLimit = `${memoryLimit} megabytes`;

    // parse the problem statement
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

    // parse the sample inputs and outputs and relavent notes
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
    // get current date and time
    const currentDateTime = getCurrentDateTime();

    const problem = {
        problemID,
        title,
        timeLimit,
        memoryLimit,
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
        throw new Error('Invalid Url');
    }
    return match[1];
}

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

module.exports = parseAtcoderProblem;
