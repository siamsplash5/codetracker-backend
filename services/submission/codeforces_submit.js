/*

Title: Codeforces Submission System
Description: Submit to the codeforces.com by sending post request to their server.
Receive: contest id (ex: 1667), problemIndex (ex: a, b, c), langID, source code.
Return: Verdict of that problem
Author: Siam Ahmed
Date: 24-04-2023

*/

// dependencies
const client = require('../db_controllers/codeforces_client');

// get verdict idea
// after submit user html will contain the submission ID,
// you can parse the website with that submission id

// submit the received source code to the codeforces server
async function codeforcesSubmit(info) {
    try {
        const { contestID, problemIndex, langID, sourceCode } = info;
        const superagent = client.getSuperAgent();
        const csrf = client.getCsrf();
        const ftaa = client.getFtaa();
        const bfaa = client.getBfaa();
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
