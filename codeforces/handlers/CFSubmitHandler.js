/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
const client = require('../data/client');
const helper = require('../helpers/CFSubmitHelper');

async function submit(info) {
    try {
        const superagent = client.getSuperAgent();
        const csrf = client.getCsrf();
        const ftaa = client.getFtaa();
        const bfaa = client.getBfaa();
        const { contestID, problemIndex, langID, sourceCode } = info;
        const submitUrl = `https://codeforces.com/contest/${contestID}/submit`;
        const url = `${submitUrl}?csrf_token=${csrf}`;

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

        const dashboard = await superagent
            .post(url)
            .send(submitData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        const verdict = helper.getVerdict(dashboard.text);
        return verdict;
    } catch (error) {
        return error;
    }
}

module.exports = { submit };
