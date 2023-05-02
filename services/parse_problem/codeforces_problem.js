const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { readProblem, createProblem } = require('../../database/queries/cf_problem_query');
const getCurrentDateTime = require('../../lib/getCurrentDateTime');

async function parseProblem(url, problemID) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    if (page.url() !== url) {
        throw new Error('Invalid parsing information');
    }
    // parsing the problem statement container from the webpage
    const problemStatementHTML = await page.$eval('.problem-statement', (el) => el.innerHTML);

    // load problem statement html to cheerio for queries
    const $ = cheerio.load(problemStatementHTML);

    // parsing title of the problem
    const title = $('.header .title').text().trim();

    // parsing time and memory limit of the problem
    const timeLimit = $('.header .time-limit').text().replace('time limit per test', '').trim();
    const memoryLimit = $('.header .memory-limit')
        .text()
        .replace('memory limit per test', '')
        .trim();

    // parsing problem body, input, output statements
    const body = $('div:not([class]):not([id])').html();
    const input = $('div.input-specification').html();
    const output = $('div.output-specification').html();
    const interaction = $('div.section-title:contains("Interaction")').parent().html();

    // parsing sample input and output
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

    // parsing tags and problem ratings
    // eslint-disable-next-line prettier/prettier
    const tags = await page.$$eval('span.tag-box', (els) => els.map((el) => el.innerHTML.toString().trim().replace(/\n\s*/g, '')));
    let rating = null;
    if (tags[tags.length - 1][0] === '*') {
        rating = tags.pop();
    }

    // get the current date and time
    const currentDateTime = getCurrentDateTime();

    const problem = {
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

function extractProblemID(url) {
    const regex = /\/(\d+)\/([a-z])$/;
    const match = url.match(regex);
    if (match) {
        const problemCode = match[1] + match[2].toUpperCase();
        return problemCode;
    }
    throw new Error('Invalid Url');
}

async function parseCodeforcesProblem(url) {
    try {
        const problemID = extractProblemID(url);
        let problem = await readProblem(problemID);
        if (problem === 'not found') {
            problem = await parseProblem(url, problemID);
            await createProblem(problem);
        }
        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = parseCodeforcesProblem;
