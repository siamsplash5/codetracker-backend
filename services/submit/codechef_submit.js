/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable object-curly-newline */

/*

Error: Forbidden
    at Request.callback (D:\project-app\server\node_modules\superagent\lib\node\index.js:845:17)
    at IncomingMessage.<anonymous> (D:\project-app\server\node_modules\superagent\lib\node\index.js:1070:18)
    at Stream.emit (node:events:513:28)
    at Unzip.<anonymous> (D:\project-app\server\node_modules\superagent\lib\node\unzip.js:54:12)
    at Unzip.emit (node:events:513:28)
    at endReadableNT (node:internal/streams/readable:1359:12)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)

*/
const client = require('../data/client');
// const randomStringGenerator = require('../../helpers/randomStringGenerator');
// const helper = require('../helpers/submitHelper');

async function codechefSubmit(info) {
    try {
        const superagent = client.getSuperAgent();

        const { contestID, problemIndex, langID, sourceCode } = info;
        console.log('kawa2');
        const submitUrl = 'https://www.codechef.com/api/ide/submit';
        const submitData = {
            sourceCode,
            language: langID,
            problemCode: problemIndex,
            contestCode: contestID,
            serviceName: 'spoj',
        };
        console.log('kawa3');
        // const token = randomStringGenerator({
        //     lowerCase: true,
        //     upperCase: true,
        //     numbers: true,
        //     specialChar: false,
        //     stringLen: 16,
        // });
        console.log('kawa4');
        const dashboard = await superagent
            .post(submitUrl)
            .field('sourceCode', submitData.sourceCode)
            .field('language', submitData.language)
            .field('problemCode', submitData.problemCode)
            .field('contestCode', submitData.contestCode)
            .field('serviceName', submitData.serviceName)
            .set('content-type', 'multipart/form-data; boundary=----WebKitFormBoundaryfhQA8c1YoBm4cWgh');

            // try with last weapon, csrf token
        console.log('kawa5');
        // const verdict = helper.getVerdict(dashboard.text);
        return dashboard.text;
    } catch (error) {
        return error;
    }
}

module.exports = { codechefSubmit };
