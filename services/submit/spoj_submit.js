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
const client = require('../db_controllers/spoj_client');
const randomStringGenerator = require('../../helpers/randomStringGenerator');

// submit the received solution to the judge
async function spojSubmit(info) {
    try {
        const submitUrl = 'https://www.spoj.com/submit/complete/';
        const formToken = randomStringGenerator({
            lowerCase: true,
            upperCase: true,
            numbers: true,
            specialChar: false,
            stringLen: 16,
        });
        const superagent = client.getSuperAgent();
        const { problemIndex, langID, sourceCode } = info;
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
        // const verdict = helper.getVerdict(dashboard.text);
        return res;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { spojSubmit };
