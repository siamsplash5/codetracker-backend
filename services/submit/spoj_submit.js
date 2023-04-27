/* eslint-disable prettier/prettier */
/*

Title: SPOJ Submission System
Description: Submit to the spoj.com by sending post request to their server.
Receive: problemIndex (ex: FIBEZ), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const cheerio = require('cheerio');
const bot = require('../db_controllers/queries/auth_data_query');
const randomStringGenerator = require('../../lib/randomStringGenerator');
const { spojLogin } = require('../login/spoj_login');

function getSubmissionID(html) {
    try {
        const $ = cheerio.load(html);
        const input = $('input[name="newSubmissionId"]');
        const submissionID = input.attr('value');
        if (submissionID !== null) {
            return submissionID;
        }
        throw new Error('submission ID not found');
    } catch (error) {
        throw new Error(error);
    }
}

async function isLogin(username) {
    const url = 'https://www.spoj.com/';
    const res = await superagent.get(url);
    if (res.status !== 200) {
        throw new Error('SPOJ Connection Error');
    }
    return res.text.includes(username);
}

// submit the received solution to the judge
async function spojSubmit(info) {
    try {
        const { problemIndex, langID, sourceCode } = info;
        const submitUrl = 'https://www.spoj.com/submit/complete/';
        const formToken = randomStringGenerator({
            lowerCase: true,
            upperCase: true,
            numbers: true,
            specialChar: false,
            stringLen: 16,
        });

        let botInfo = await bot.readInfo('bot_user_1', 'spoj');
        const { username, password, spojCredentials } = botInfo;

         // If cookie exist, set cookie, then we will check it is expired or not
        if (spojCredentials.cookie.length >= 2) {
            superagent.jar.setCookies(spojCredentials.cookie);
        }

        // check user login or not
        if ((await isLogin(username)) === false) {
            await spojLogin(username, password);
            botInfo = await bot.readInfo(username, 'spoj');
        }

        const { cookie } = botInfo.spojCredentials;
        superagent.jar.setCookies(cookie);

        const submitData = {
            subm_file: '(binary)',
            file: sourceCode,
            lang: langID,
            problemcode: problemIndex,
            submit: 'Submit!',
        };
        const res = await superagent
            .post(submitUrl)
            .field(submitData)
            .set(
                'content-type',
                `multipart/form-data; boundary=----WebKitFormBoundary${formToken}`,
            );

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`SPOJ submit failed, status code ${res.status}`);
        }

        const submissionID = getSubmissionID(res.text);
        return { superagent, username, submissionID };
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { spojSubmit };
