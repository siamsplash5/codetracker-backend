/* eslint-disable prettier/prettier */
/*

Title: Timus Submission System
Description: Submit to the acm.timus.ru by sending post request to their server.
Receive: problemIndex (ex: 1000), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const randomStringGenerator = require('../../lib/randomStringGenerator');
const { decryptPassword } = require('../../lib/encryption');
const bot = require('../db_controllers/queries/auth_data_query');

// const cheerio = require('cheerio');

// async function sleep(ms) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function getVerdict() {
//     // await sleep(5000);
//     const html = (await superagent.get('https://acm.timus.ru/status.aspx')).text;
//     // eslint-disable-next-line prettier/prettier
//     const $ = cheerio.load(html);

//     // Find the <A> tag with innerHTML "Bot Bro"
//     const coderTag = $('td.coder a:contains("Bot Bro")');

//     // Get the parent <tr> element
//     const trElement = coderTag.closest('tr');

//     // Extract the information from the <td> elements in the <tr> element
//     const id = trElement.find('td.id').text();
//     const date = trElement.find('td.date nobr:last-of-type').text();
//     const problem = trElement.find('td.problem').text().trim();
//     const language = trElement.find('td.language').text();
//     const verdict = trElement.find('td.verdict_rj').text();
//     const test = trElement.find('td.test').text();
//     const runtime = trElement.find('td.runtime').text();
//     const memory = trElement.find('td.memory').text();
//     return {
//         id,
//         date,
//         problem,
//         language,
//         verdict,
//         test,
//         runtime,
//         memory,
//     };
// }

// submit the solution to the acm.timus.ru, no login required
async function timusSubmit(info) {
    try {
        const { problemIndex, langID, sourceCode } = info;
        const submitUrl = 'https://acm.timus.ru/submit.aspx?space=1';
        const formToken = randomStringGenerator({
            lowerCase: true,
            upperCase: true,
            numbers: true,
            specialChar: false,
            stringLen: 16,
        });
        const data = await bot.readInfo('bot_user_1', 'timus');
        console.log(data.timusCredentials.judgeID);
        const judgeID = decryptPassword(data.timusCredentials.judgeID, process.env.SECRET_KEY);

        const res = await superagent
            .post(submitUrl)
            .field('Action', 'submit')
            .field('SpaceID', 1)
            .field('JudgeID', judgeID)
            .field('Language', langID)
            .field('ProblemNum', problemIndex)
            .field('Source', sourceCode)
            .field('SourceFile', '(binary)')
            .set(
                'content-type',
                `multipart/form-data; boundary=----WebKitFormBoundary${formToken}`,
            );

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`SPOJ submit failed, status code ${res.status}`);
        }
        // const verdict = await getVerdict();
        // return verdict;
        return res;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { timusSubmit };
