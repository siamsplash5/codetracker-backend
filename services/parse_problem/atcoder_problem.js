/* eslint-disable max-len */
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
// const { readProblem, createProblem } = require('../../database/queries/cf_problem_query');

async function parseProblem(_url) {
    const url = _url.toLowerCase();
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    if (page.title() === '404 Not Found - AtCoder') {
        throw new Error('Invalid Url');
    }
    const pattern = /\/tasks\/([a-z0-9_]+)/i;
    const match = url.match(pattern);
    if (!(match && match.length > 1)) {
        throw new Error('Invalid Url');
    }
    const problemID = match[1];
    const problemStatementHTML = await page.$eval(
        '#task-statement',
        (el) => el.parentElement.innerHTML
    );
    // const problemStatementHTML = await page.content();
    const $ = cheerio.load(problemStatementHTML);
    const len = $('.part').length;
    const title = $('span.h2').text().trim().replace('Editorial', '');
    const timeAndMemoryLimit = $('p').eq(0).text().trim();
    let timeLimit = timeAndMemoryLimit.match(/Time Limit: (\d+) sec/)[1];
    let memoryLimit = timeAndMemoryLimit.match(/Memory Limit: (\d+) MB/)[1];
    timeLimit = timeLimit === '1' ? `${timeLimit} second` : `${timeLimit} seconds`;
    memoryLimit = `${memoryLimit} megabytes`;
    const inputs = [];
    const outputs = [];
    const totalPreTag = len / 2 - 4;
    console.log(totalPreTag);
    for (let i = totalPreTag; i <= 2 * totalPreTag - 1; i += 1) {
        const data = $(`#pre-sample${i}`).text().trim();
        if (i % 2 === 0) {
            inputs.push(data);
        } else {
            outputs.push(data);
        }
    }

    // const problem = {
    //     problemID,
    //     title,
    //     timeLimit,
    //     memoryLimit,
    //     problemStatement: {
    //         problem: $('div.part')
    //             .eq(len + 1)
    //             .html(),
    //         constraint: $('div.part')
    //             .eq(len + 2)
    //             .html(),
    //         input: $('div.part')
    //             .eq(len + 3)
    //             .html(),
    //         output: $('div.part')
    //             .eq(len + 4)
    //             .html(),
    //     },
    //     sampleTestCase: {
    //         sampleInputs,
    //         sampleOutputs,
    //     },
    //     notes: $('div.note').html(),
    //     score,
    //     source: url,
    //     parsedAt: new Date().toLocaleString('en-US', {
    //         timeZone: 'Asia/Dhaka',
    //         day: '2-digit',
    //         month: '2-digit',
    //         year: 'numeric',
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         second: 'numeric',
    //         hour12: true,
    //     }),
    // };
    return problemStatementHTML;
}

async function parseAtcoderProblem(url) {
    try {
        // let problem = await readProblem(problemID);
        // if (problem === 'not found') {
        //     problem = await parseProblem(problemID);
        //     await createProblem(problem);
        // }
        // return problem;
        const problem = await parseProblem(url);
        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = parseAtcoderProblem;
