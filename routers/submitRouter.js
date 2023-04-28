const express = require('express');
const atcoderSubmit = require('../services/submit/atcoder_submit');
const watchAtcoderVerdict = require('../services/watch-verdict/atcoder_verdict');
const codeforcesSubmit = require('../services/submit/codeforces_submit');
const watchCodeforcesVerdict = require('../services/watch-verdict/codeforces_verdict');
const spojSubmit = require('../services/submit/spoj_submit');
const watchSPOJVerdict = require('../services/watch-verdict/spoj_verdict');
const timusSubmit = require('../services/submit/timus_submit');
const watchTimusVerdict = require('../services/watch-verdict/timus_verdict');

const submitRouter = express.Router();

submitRouter.get('/', async (req, res) => {
    try {
        const submitInfo = {
            judge: 'atcoder',
            contestID: 'diverta2019',
            problemIndex: 'c',
            langID: 4003,
            sourceCode: String.raw`#include <bits/stdc++.h>
using namespace std;
typedef long long int lld;
#define test lld tt; scanf("%lld", &tt); while(tt--)
#define dbug cout <<"dukse" <<endl;

int main() {
    lld n, x; cin >> n;
    bool f = false;
    lld ans = 0;
    lld ba, aa, bb, bc, ca, a, b;
    a = b = ba = aa = bb = bc = ca = 0;
    while (n--) {
        string s; cin >> s;
        for (int i = 0; i < s.size() - 1; i++) {
            ans += (s[i] == 'A' and s[i + 1] == 'B');
        }
        a += (s.size() == 1 and s[0] == 'A');
        b += (s.size() == 1 and s[0] == 'B');
        ba += (s[0] == 'B' and s.back() == 'A');
        aa += (s[0] == 'A' and s.back() == 'A');
        bb += (s[0] == 'B' and s.back() == 'B');
        bc += (s[0] == 'B' and !(s.back() == 'A' or s.back() == 'B'));
        ca += (!(s[0] == 'A' or s[0] == 'B') and s.back() == 'A');
    }
    if (ba > 1)f = true;
    else if (a or aa or ca) {
        f = true;
    }
    // cout << ans << endl;
    // cout << "a" << " " << a << endl;
    // cout << "b" << " " << b << endl;
    // cout << "ba" << " " << ba << endl;
    // cout << "aa" << " " << aa << endl;
    // cout << "bb" << " " << bb << endl;
    // cout << "bc" << " " << bc << endl;
    // cout << "ca" << " " << ca << endl;

    x = min(aa, bb);
    ans += x; aa -= x; bb -= x;

    x = min(aa, ba);
    ans += x; aa -= x; ba -= x;

    x = min(bb, ba);
    ans += x; bb -= x; ba -= x;

    x = min(ba, bc);
    ans += x; ba -= x; bc -= x;

    x = min(aa, bc);
    ans += x; aa -= x; bc -= x;

    x = min(ba, ca);
    ans += x; ba -= x; ca -= x;

    x = min(bb, ca);
    ans += x; bb -= x; ca -= x;

    x = min(bc, ca);
    ans += x; bc -= x; ca -= x;

    x = min(a, b);
    ans += x; a -= x; b -= x;

    x = min(a, ba);
    ans += x; a -= x; ba -= x;

    x = min(a, bb);
    ans += x; a -= x; bb -= x;

    x = min(a, bc);
    ans += x; a -= x; bc -= x;

    x = min(aa, b);
    ans += x; aa -= x; b -= x;

    x = min(ba, b);
    ans += x; ba -= x; b -= x;

    x = min(ca, b);
    ans += x; ca -= x; b -= x;

    if (ba)ans += f;
    cout << ans  << endl;
    return 0;
}`,
        };
        let status;
        if (submitInfo.judge === 'atcoder') {
            const watchInfo = await atcoderSubmit(submitInfo);
            console.log('submitted');
            status = await watchAtcoderVerdict(watchInfo);
        }
        if (submitInfo.judge === 'codeforces') {
            const watchInfo = await codeforcesSubmit(submitInfo);
            console.log('submitted');
            status = await watchCodeforcesVerdict(watchInfo);
        }
        if (submitInfo.judge === 'spoj') {
            const watchInfo = await spojSubmit(submitInfo);
            console.log('submitted');
            status = await watchSPOJVerdict(watchInfo);
        }
        if (submitInfo.judge === 'timus') {
            const watchInfo = await timusSubmit(submitInfo);
            console.log('submitted');
            status = await watchTimusVerdict(watchInfo);
        }
        res.send(status);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = submitRouter;
