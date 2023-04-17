const express = require('express');
const dotenv = require('dotenv');
const { login } = require('../codeforces/handlers/CFLoginHandler');
const { submit } = require('../codeforces/handlers/CFSubmitHandler');

const app = express();
dotenv.config();

app.get('/cflogin', (req, res) => {
    (async () => {
        const userName = await login();
        console.log(`Login Successful! Current User: ${userName}`);
        res.send(`Logged in as a ${userName}`);
    })();
});

app.get('/cfsubmit', (req, res) => {
    (async () => {
        const info = {
            contestID: '4',
            problemIndex: 'A',
            langID: 73,
            sourceCode: `
            #include <bits/stdc++.h>
using namespace std;
int main() {
    int w; cin >> w;
    if(w % 2 == 0 && w > 3){
        printf("YES");
    }else{
        printf("NO");
    }
}
            `,
        };
        const msg = await submit(info);
        console.log('Submission successful');
        res.send(msg);
    })();
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
