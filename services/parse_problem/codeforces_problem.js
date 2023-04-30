const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function parseProblem(url, problemID) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const currentUrl = page.url();
    if (currentUrl !== url) {
        throw new Error('Invalid parsing information');
    }
    const problemStatementHTML = await page.$eval('.problem-statement', (el) => el.innerHTML);
    // eslint-disable-next-line prettier/prettier
    const tags = await page.$$eval('span.tag-box', (els) => els.map((el) => el.innerHTML.toString().trim().replace(/\n\s*/g, '')));
    const rating = tags.pop();
    const $ = cheerio.load(problemStatementHTML);

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

    const problem = {
        problemId: problemID,
        title: $('.header .title').text().trim(),
        timeLimit: $('.header .time-limit').text().replace('time limit per test', '').trim(),
        memoryLimit: $('.header .memory-limit').text().replace('memory limit per test', '').trim(),
        problemStatement: {
            bodyStatement: $('div:not([class]):not([id])').html(),
            inputStatement: $('div.input-specification').html(),
            outputStatement: $('div.output-specification').html(),
        },
        sampleTestCase: {
            inputs,
            outputs,
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
        const matches = problemID.match(/^(\d+)([a-zA-Z0-9]+)$/);
        const contestID = matches[1];
        const problemIndex = matches[2];
        const url = `https://codeforces.com/problemset/problem/${contestID}/${problemIndex}/`;
        const problem = await parseProblem(url, problemID);

        return problem;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

module.exports = parseCodeforcesProblem;
