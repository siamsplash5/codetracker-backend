const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { readProblem, createProblem } = require('../../database/queries/cf_problem_query');

async function parseProblem(problemID) {
    const matches = problemID.match(/^(\d+)([a-zA-Z0-9]+)$/);
    const contestID = matches[1];
    const problemIndex = matches[2];
    const url = `https://codeforces.com/problemset/problem/${contestID}/${problemIndex}/`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    if (page.url() !== url) {
        throw new Error('Invalid parsing information');
    }
    const problemStatementHTML = await page.$eval('.problem-statement', (el) => el.innerHTML);
    // eslint-disable-next-line prettier/prettier
    const tags = await page.$$eval('span.tag-box', (els) => els.map((el) => el.innerHTML.toString().trim().replace(/\n\s*/g, '')));
    const $ = cheerio.load(problemStatementHTML);
    const inputDivs = $('div.sample-test .input');
    const outputDivs = $('div.sample-test .output');
    const sampleInputs = [];
    const sampleOutputs = [];
    let rating = null;

    if (tags[tags.length - 1][0] === '*') {
        rating = tags.pop();
    }

    inputDivs.each((index, element) => {
        const inputDivHTML = $.html(element);
        if ($('.test-example-line').length > 0) {
            const testExampleLineClass = $(inputDivHTML).find('.test-example-line');
            let inputData = '';
            testExampleLineClass.each((index2, element2) => {
                inputData += `${$(element2).text().trim()}\n`;
            });
            sampleInputs.push(inputData);
        } else {
            const preTag = $(inputDivHTML).find('pre');
            const preTagInnerHTML = preTag.html();
            const modifiedSampleTest = preTagInnerHTML.replace(/<br>/g, '\n');
            sampleInputs.push(modifiedSampleTest);
        }
    });
    outputDivs.each((index, element) => {
        const outputDivHTML = $.html(element);
        const preTag = $(outputDivHTML).find('pre');
        const preTagInnerHTML = preTag.html();
        const modifiedSampleTest = preTagInnerHTML.replace(/<br>/g, '\n');
        sampleOutputs.push(modifiedSampleTest);
    });

    const problem = {
        problemID,
        title: $('.header .title').text().trim(),
        timeLimit: $('.header .time-limit').text().replace('time limit per test', '').trim(),
        memoryLimit: $('.header .memory-limit').text().replace('memory limit per test', '').trim(),
        problemStatement: {
            body: $('div:not([class]):not([id])').html(),
            input: $('div.input-specification').html(),
            interaction: $('div.section-title:contains("Interaction")').parent().html(),
            output: $('div.output-specification').html(),
        },
        sampleTestCase: {
            sampleInputs,
            sampleOutputs,
        },
        notes: $('div.note').html(),
        tags,
        rating,
        source: url,
        parsedAt: new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Dhaka',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        }),
    };
    return problem;
}

async function parseCodeforcesProblem(problemID) {
    try {
        let problem = await readProblem(problemID);
        if (problem === 'not found') {
            problem = await parseProblem(problemID);
            await createProblem(problem);
        }
        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = parseCodeforcesProblem;
