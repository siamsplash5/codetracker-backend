/*

Title: Atcoder Submission System
Description: Submit to the atocder.jp by sending post request to their server.
Receive: contest id (ex: abc065), problemIndex (ex: a, b, c), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
const bot = require('../db_controllers/queries/auth_data_query');
const { atcoderLogin } = require('../login/atcoder_login');

async function isLogin(username) {
    const url = 'https://atcoder.jp/';
    const res = await superagent.get(url);
    if (!res.status === 200) {
        throw new Error('Atcoder Connection Error');
    }
    const html = res.text;
    const regex = /var userScreenName = "(.*?)"/;
    const tmp = regex.exec(html);
    if (tmp === null || tmp.length < 2) {
        return false;
    }
    return username === tmp[1];
}

// submit the received code to atcoder judge
async function atcoderSubmit(info) {
    try {
        const { contestID, problemIndex, langID, sourceCode } = info;
        const submitUrl = `https://atcoder.jp/contests/${contestID}/submit`;
        let botInfo = await bot.readInfo('bot_user_1', 'atcoder');
        const { username, password, atcoderCredentials } = botInfo;

        // If cookie exist, set cookie, then we will check it is expired or not
        if (atcoderCredentials.cookie.length >= 2) {
            superagent.jar.setCookies(atcoderCredentials.cookie);
        }

        // check user login or not
        if ((await isLogin(username)) === false) {
            await atcoderLogin(username, password);
            botInfo = await bot.readInfo(username, 'atcoder');
        }
        const { csrf, cookie } = botInfo.atcoderCredentials;
        superagent.jar.setCookies(cookie);

        const submitData = {
            'data.TaskScreenName': `${contestID}_${problemIndex}`,
            'data.LanguageId': langID,
            sourceCode,
            csrf_token: csrf,
        };

        const res = await superagent
            .post(submitUrl)
            .send(submitData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        if (res.status !== 200 && res.status !== 301 && res.status !== 302) {
            throw new Error(`Atcoder submit failed, status code ${res.status}`);
        }

        // const verdict = helper.getVerdict(dashboard.text);
        return res;
    } catch (error) {
        console.log(error.message);
        throw new Error(error);
    }
}

module.exports = { atcoderSubmit };
