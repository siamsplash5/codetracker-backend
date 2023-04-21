/* eslint-disable no-promise-executor-return */
/* eslint-disable comma-dangle */
const superagent = require('superagent').agent();
const cheerio = require('cheerio');

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getVerdict() {
    // await sleep(5000);
    const html = (await superagent.get('https://acm.timus.ru/status.aspx')).text;
    // eslint-disable-next-line prettier/prettier
    const $ = cheerio.load(html);

    // Find the <A> tag with innerHTML "Bot Bro"
    const coderTag = $('td.coder a:contains("Bot Bro")');

    // Get the parent <tr> element
    const trElement = coderTag.closest('tr');

    // Extract the information from the <td> elements in the <tr> element
    const id = trElement.find('td.id').text();
    const date = trElement.find('td.date nobr:last-of-type').text();
    const problem = trElement.find('td.problem').text().trim();
    const language = trElement.find('td.language').text();
    const verdict = trElement.find('td.verdict_rj').text();
    const test = trElement.find('td.test').text();
    const runtime = trElement.find('td.runtime').text();
    const memory = trElement.find('td.memory').text();
    return {
        id,
        date,
        problem,
        language,
        verdict,
        test,
        runtime,
        memory,
    };
}

async function timusSubmit(info) {
    try {
        // const { problemIndex, langID, sourceCode } = info;
        // const submitUrl = 'https://acm.timus.ru/submit.aspx?space=1';

        // await superagent
        //     .post(submitUrl)
        //     .field('Action', 'submit')
        //     .field('SpaceID', 1)
        //     .field('JudgeID', process.env.TIMUS_JUDGE_ID)
        //     .field('Language', langID)
        //     .field('ProblemNum', problemIndex)
        //     .field('Source', sourceCode)
        //     .field('SourceFile', '(binary)')
        //     .set(
        //         'content-type',
        //         'multipart/form-data; boundary=----WebKitFormBoundaryfhQA8c1YoBm4cWgh'
        //     );
        const verdict = await getVerdict();
        return verdict;
    } catch (error) {
        return error;
    }
}

module.exports = { timusSubmit };
