const express = require('express');
const dotenv = require('dotenv');
const client = require('../codechef/data/client');
const { cfLogin } = require('../codeforces/handlers/loginHandler');
const { cfSubmit } = require('../codeforces/handlers/submitHandler');
const { atcoderLogin } = require('../atcoder/handlers/loginHandler');
const { atcoderSubmit } = require('../atcoder/handlers/submitHandler');
const { lightojLogin } = require('../lightoj/handlers/loginHandler');
const { codechefLogin } = require('../codechef/handlers/loginHandler');
const { codechefSubmit } = require('../codechef/handlers/submitHandler');

const app = express();
dotenv.config();

app.get('/codeforces/login', (req, res) => {
    (async () => {
        const userName = await cfLogin();
        console.log(`CF Login Successful! Current User: ${userName}`);
        res.send(`Logged in CF as a ${userName}`);
    })();
});

app.get('/codeforces/submit', (req, res) => {
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
    if(w % 2 == 0 && w > 1){
        printf("YES");
    }else{
        printf("NO");
    }
}
            `,
        };
        const msg = await cfSubmit(info);
        console.log('Submission successful');
        res.send(msg);
    })();
});

app.get('/atcoder/login', (req, res) => {
    (async () => {
        const userName = await atcoderLogin();
        console.log(`Atcoder Login Successful! Current User: ${userName}`);
        res.send(`Logged in Atcoder as a ${userName}`);
    })();
});

app.get('/atcoder/submit', (req, res) => {
    (async () => {
        const info = {
            contestID: 'abc065',
            problemIndex: 'b',
            langID: 4003,
            sourceCode: `
#include <bits/stdc++.h>
using namespace std;
typedef long long int lld;

int main() {
    lld n; cin >> n;
    lld a[n + 2];
    bool mark[n + 2] = {false};
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
    }
    lld op = 0, pos = 1;
    while (1) {
        if (pos == 2)break;
        if (mark[pos]) {
            op = -1;
            break;
        }
        mark[pos] = true;
        pos = a[pos];
        op++;
    }
    cout << op << endl;
    return 0;
}`,
        };
        const msg = await atcoderSubmit(info);
        console.log('Submission successful');
        res.send(msg);
    })();
});

app.get('/lightoj/login', (req, res) => {
    (async () => {
        const userName = await lightojLogin();
        // console.log(`LightOJ Login Successful! Current User: ${userName}`);
        // res.send(`Logged in LightOJ as a ${userName}`);
        res.send(userName);
    })();
});

app.get('/codechef/login', (req, res) => {
    (async () => {
        const userName = await codechefLogin();
        // console.log(userName);
        res.send(userName);
    })();
});

app.get('/codechef/dashboard', (req, res) => {
    (async () => {
        const superagent = client.getSuperAgent();
        const dashboard = await superagent.get('https://www.codechef.com/users/bot_user_1/edit');
        res.send(dashboard.text);
    })();
});

app.get('/codechef/submit', (req, res) => {
    (async () => {
        const info = {
            contestID: 'PRACTICE',
            problemIndex: 'NTRIPLETS',
            langID: '63',
            sourceCode: 'Hello',
        };
        const msg = await codechefSubmit(info);
        console.log(msg);
        console.error(msg.stack);
        res.send(msg);
    })();
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
