/* eslint-disable comma-dangle */
const superagent = require('superagent').agent();

async function submit(csrf, ftaa, bfaa) {
    try {
        const url = `https://codeforces.com/contest/4/submit?csrf_token=${csrf}`;
        const submitData = {
            csrf_token: csrf,
            ftaa,
            bfaa,
            action: 'submitSolutionFormSubmitted',
            submittedProblemIndex: 'A',
            programTypeId: 73,
            source: '#include <bits/stdc++.h> using namespace std; int main(){ int w; cin >> w; cout <<((w % 2 == 0 && w > 2)? "YES" : "NO") <<endl;',
            tabSize: 4,
            sourceFile: null,
            _tta: 104,
        };
        const dashboard = await superagent
            .post(url)
            .send(submitData)
            .set('Content-Type', 'application/x-www-form-urlencoded');
        return dashboard.text;
    } catch (error) {
        return error;
    }
}

module.exports = { submit };
