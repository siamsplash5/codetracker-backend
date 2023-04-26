/*

Title: Codeforces Submission System
Description: Submit to the codeforces.com by sending post request to their server.
Receive: contest id (ex: 1667), problemIndex (ex: a, b, c), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const superagent = require('superagent').agent();
// const bot = require('../db_controllers/cf');
const bot = require('../db_controllers/queries/auth_data_query');
const { codeforcesLogin } = require('../login/codeforces_login');

// get verdict idea
// after submit user html will contain the submission ID,
// you can parse the website with that submission id

// submit the received source code to the codeforces server

async function isLogin(username) {
    const url = 'https://codeforces.com/';
    const res = await superagent.get(url);
    if (!res.status === 200) {
        throw new Error('Atcoder Connection Error');
    }
    const html = res.text;
    const regex = /var handle = "(.*?)"/;
    const tmp = regex.exec(html);
    if (tmp === null || tmp.length < 2) {
        return false;
    }
    return username === tmp[1];
}

async function codeforcesSubmit(info) {
    try {
        const { contestID, problemIndex, langID, sourceCode } = info;

        let botInfo = await bot.readInfo('bot_user_1', 'codeforces');
        console.log('45');
        const { username, password, codeforcesCredentials } = botInfo;
        // If cookie exist, set cookie, then we will check it is expired or not
        if (codeforcesCredentials.cookie.length > 2) {
            console.log('54');
            superagent.jar.setCookies(codeforcesCredentials.cookie);
        }

        // check the user login or not
        if ((await isLogin(username)) === false) {
            console.log(61);
            await codeforcesLogin(username, password);
            console.log(63);
            botInfo = await bot.readInfo(username, 'codeforces');
        }
        console.log(botInfo);
        const { csrf, ftaa, bfaa, cookie } = botInfo.codeforcesCredentials;
        superagent.jar.setCookies(cookie);

        const submitUrl = `https://codeforces.com/contest/${contestID}/submit?csrf_token=${csrf}`;
        const submitData = {
            csrf_token: csrf,
            ftaa,
            bfaa,
            action: 'submitSolutionFormSubmitted',
            submittedProblemIndex: problemIndex,
            programTypeId: langID,
            source: sourceCode,
            tabSize: 4,
            _tta: 104,
        };

        const res = await superagent
            .post(submitUrl)
            .send(submitData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        return res;
    } catch (error) {
        return error;
    }
}

module.exports = { codeforcesSubmit };
