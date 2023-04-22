/* eslint-disable comma-dangle */
const client = require('../data/client');

async function spojSubmit(info) {
    try {
        const superagent = client.getSuperAgent();
        const { problemIndex, langID, sourceCode } = info;
        const submitUrl = 'https://www.spoj.com/submit/complete/';
        const submitData = {
            subm_file: '(binary)',
            file: sourceCode,
            lang: langID,
            problemcode: problemIndex,
            submit: 'Submit!',
        };
        const dashboard = await superagent
            .post(submitUrl)
            .field(submitData)
            .set(
                'content-type',
                'multipart/form-data; boundary=----WebKitFormBoundaryfhQA8c1YoBm4cWgh'
            );

        // const verdict = helper.getVerdict(dashboard.text);
        return dashboard;
    } catch (error) {
        console.log(error);
        return 'Submit failed';
    }
}

module.exports = { spojSubmit };
