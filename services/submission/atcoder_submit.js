/*

Title: Atcoder Submission System
Description: Submit to the atocder.jp by sending post request to their server.
Receive: contest id (ex: abc065), problemIndex (ex: a, b, c), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const client = require('../db_controllers/atcoder_client');

// submit the received code to atcoder judge
async function atcoderSubmit(info) {
    try {
        const superagent = client.getSuperAgent();
        const csrf = client.getCsrf();

        const { contestID, problemIndex, langID, sourceCode } = info;
        const submitUrl = `https://atcoder.jp/contests/${contestID}/submit`;
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
        throw new Error(error);
    }
}

module.exports = { atcoderSubmit };
