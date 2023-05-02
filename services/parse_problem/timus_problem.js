/* eslint-disable max-len */
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { readProblem, createProblem } = require('../../database/queries/timus_problem_query');

async function parseProblem(url, problemID) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    if ((await page.title()) === 'Timus Online Judge') {
        throw new Error('Invalid Url');
    }
    // grab the div element which contain the problem statement
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

    // parsing notes of input output secions
    let note = $('h3.problem_subtitle:contains("Notes")').next().html();
    if (note) note = note.replace(/\n(?=\S)/g, '');

    // parsing full problem statement
    let count = 0;
    const bg = $('h3.problem_subtitle:contains("Background")').length;
    if (bg > 0) count -= 1;
    let background = '';
    let problemStat = '';
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
            problemStat += `${data}\n\n`;
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

    const problem = {
        problemID,
        title,
        timeLimit,
        memoryLimit,
        problemStatement: {
            background,
            problem: problemStat,
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

async function parseTimusProblem(_url) {
    try {
        const url = _url.toLowerCase();
        const pattern = /num=(\d+)/;
        const match = url.match(pattern);
        if (!match) {
            throw new Error('Invalid Url');
        }
        const problemID = match[1];
        let problem = await readProblem(url, problemID);
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

module.exports = parseTimusProblem;
