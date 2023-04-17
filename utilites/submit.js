/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
const client = require('./client');

async function submit() {
    try {
        const superagent = client.getSuperAgent();
        const csrf = client.getCsrf();
        const ftaa = client.getFtaa();
        const bfaa = client.getBfaa();
        console.log(csrf);
        const submitUrl = 'https://codeforces.com/contest/4/submit';
        const url = `${submitUrl}?csrf_token=${csrf}`;
        const submitData = {
            csrf_token: csrf,
            ftaa,
            bfaa,
            action: 'submitSolutionFormSubmitted',
            submittedProblemIndex: 'A',
            programTypeId: 73,
            source: `#include <bits/stdc++.h>
             using namespace std; 
             int main(){ 
                int w; cin >> w; 
                cout <<((w % 2 == 0 && w > 2? "Yes" : "No") <<endl;
             }`,

            tabSize: 4,
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
