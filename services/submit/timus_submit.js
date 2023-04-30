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
const cheerio = require('cheerio');
const randomStringGenerator = require('../../lib/randomStringGenerator');
const { decryptPassword } = require('../../lib/encryption');
const bot = require('../../database/queries/bot_auth_query');

function getSubmissionID(html) {
    try {
        const $ = cheerio.load(html);
        const td = $('td.id').first();
        if (td !== null) {
            return td.text();
        }
        throw new Error('submission ID not found');
    } catch (error) {
        throw new Error(error);
    }
}

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
        const judgeID = decryptPassword(data.timusCredentials.judgeID, process.env.SECRET_KEY);
        const submitData = {
            Action: 'submit',
            SpaceID: 1,
            JudgeID: judgeID,
            Language: langID,
            ProblemNum: problemIndex,
            Source: sourceCode,
            SourceFile: '(binary)',
        };

        const res = await superagent
            .post(submitUrl)
            .field(submitData)
            .set(
                'content-type',
                `multipart/form-data; boundary=----WebKitFormBoundary${formToken}`,
            );

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`Timus submit failed, status code ${res.status}`);
        }

        const submissionID = getSubmissionID(res.text);

        // const submissionID = '10259376';

        return { superagent, submissionID };
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = timusSubmit;
