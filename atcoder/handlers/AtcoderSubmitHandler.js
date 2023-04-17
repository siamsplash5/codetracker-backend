/* eslint-disable object-curly-newline */
const client = require('../data/client');
// const helper = require('../helpers/AtcoderSubmitHelper');

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

        const dashboard = await superagent
            .post(submitUrl)
            .send(submitData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        // const verdict = helper.getVerdict(dashboard.text);
        return dashboard.text;
    } catch (error) {
        return error;
    }
}

module.exports = { atcoderSubmit };
