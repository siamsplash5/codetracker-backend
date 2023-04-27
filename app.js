/* eslint-disable comma-dangle */
const express = require('express');
const dotenv = require('dotenv').config();
// const superagent = require('superagent').agent();
const mongoose = require('mongoose');
// const { encryptPassword } = require('./lib/encryption');
// const crypto = require('crypto');
// const { codeforcesLogin } = require('./services/login/codeforces_login');
// const { codeforcesSubmit } = require('./services/submit/codeforces_submit');
// const watchCodeforcesVerdict = require('./services/watch-verdict/codeforces_verdict')
// const { atcoderLogin } = require('./services/login/atcoder_login');
// const { atcoderSubmit } = require('./services/submit/atcoder_submit');
// const { lightojLogin } = require('../lightoj/handlers/loginHandler');
// const { codechefLogin } = require('../codechef/handlers/loginHandler');
// const { codechefSubmit } = require('../codechef/handlers/submitHandler');
// const { spojLogin } = require('./services/login/spoj_login');
const { spojSubmit } = require('./services/submit/spoj_submit');
const watchSPOJVerdict = require('./services/watch-verdict/spoj_verditc');
// const { uvaLogin } = require('../uva/handlers/loginHandler');
const { timusSubmit } = require('./services/submit/timus_submit');
const watchTimusVerdict = require('./services/watch-verdict/timus_verdict');

const app = express();

// database connection with mongoose
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log('Mongoose connection successful');
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`);
        });
    })
    .catch(console.error);

// routes
app.get('/check', (req, res) => {
    (async () => {
        // const superagent = client.getSuperAgent();
        // const html = await superagent.get('https://www.spoj.com/status/');
        res.send(html.text);
    })();
});

app.get('/codeforces/login', (req, res, next) => {
    (async () => {
        try {
            const homePageHTML = await codeforcesLogin();
            res.send(homePageHTML);
        } catch (error) {
            next(error);
        }
    })();
});

app.get('/codeforces/submit', (req, res, next) => {
    (async () => {
        try {
            const submitInfo = {
                contestID: '1822',
                problemIndex: 'B',
                langID: 73,
                sourceCode: String.raw`
#include <bits/stdc++.h>
using namespace std;

#define DIM 51

int q;
int n;
long long a[DIM];

void koo(){
    sort(a,a+n);
    cout << max(a[0]*a[1],a[n-1]*a[n-2]) << "\n";
}

int main() {
    ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    cin >> q;
    while (q--) {
        cin >> n;
        for (int i = 0; i < n; i++) cin >> a[i];
        koo();
    }
}`,
            };
            const watchInfo = await codeforcesSubmit(submitInfo);
            console.log('Submission successful');
            const status = await watchCodeforcesVerdict(watchInfo);
            res.send(status);
        } catch (error) {
            next(error);
        }
    })();
});

app.get('/atcoder/login', (req, res, next) => {
    (async () => {
        try {
            const homePageHTML = await atcoderLogin();
            res.send(homePageHTML);
        } catch (err) {
            next(err);
        }
    })();
});

app.get('/atcoder/submit', (req, res) => {
    (async () => {
        const info = {
            contestID: 'abc065',
            problemIndex: 'b',
            langID: 4003,
            sourceCode: String.raw`
#include <bits/stdc++.h>
using namespace std;
typedef long long int lld;

int main() {
    lld n; cin >> n;
    lld a[n + 2];
    bool mark[n + 2] = {0};
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
    }
    lld c = 0, pos = 1;
    while (1) {
        if (pos == 2)break;
        if (mark[pos]) {
            c = -1;
            break;
        }
        mark[pos] = 1;
        pos = a[pos];
        c++;
    }
    cout << c << endl;
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

app.get('/uva/login', (req, res) => {
    (async () => {
        try {
            const homePageHTML = await uvaLogin();
            res.send(homePageHTML);
        } catch (error) {
            console.log(error);
            res.send('Login failed');
        }
    })();
});

app.get('/uva/dashboard', (req, res) => {
    (async () => {
        const myAgent = client.getSuperAgent();
        const dashboard = await myAgent.get(
            'https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=15'
        );
        res.send(dashboard.text);
    })();
});
//     (async () => {
//         const info = {
//             contestID: 'PRACTICE',
//             problemIndex: 'NTRIPLETS',
//             langID: '63',
//             sourceCode: 'Hello',
//         };
//         const msg = await codechefSubmit(info);
//         console.log(msg);
//         console.error(msg.stack);
//         res.send(msg);
//     })();
// });

app.get('/timus/submit', (req, res, next) => {
    (async () => {
        try {
            const submitInfo = {
                problemIndex: 1005,
                langID: 68,
                sourceCode: `
/*********************************Library Function*************************************/

#include <bits/stdc++.h>

/*******************************preprocessor directives********************************/

#define faster                    ios_base::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL);
#define initialize(ar, n, size)   for(int i = 0;  i<size; i++){ ar[i]=n; }
#define strRevSort(s)             sort(s.begin(), s.end(), greater<char>());
#define tab(n)                    for(int i = 0; i<n; i++){printf(" ");}
#define test                      lld t; cin >>t; while(t--)
#define strSort(s)                sort(s.begin(), s.end());
#define cs(tst)                   printf("Case %d: ", tst);
#define Y                         cout <<"YES" <<endl;
#define N                         cout <<"NO" <<endl;
#define noo                       cout <<"-1" <<endl;
#define pi a                      cos(-1)
#define cube(x)                   (x*x*x)
#define sqr(x)                    (x*x)
#define pb                        push_back
#define MAX                       1100
#define GR                        1.61803398875
#define EPS                       1e-9

/***********************************type definition***********************************/

typedef unsigned long long   ull;
typedef long long int        lld;
typedef long double          ld;
using namespace std;

int i, j;

/***********************************----START----************************************/

int ara[25];
int n, mn = 10e7 + 6;

void backtrack(int pos, int sum, std::vector<bool> isTaken)
{
	if (pos == n)
	{
		int sum1 = 0;
		for (int i = 0; i < n; i++)
		{
			if (isTaken[i])
				sum1 += ara[i];
		}

		int sum2 = sum - sum1;

		mn = min(mn, abs(sum1 - sum2));
		return;
	}

	backtrack(pos + 1, sum, isTaken);
	isTaken[pos] = true;
	backtrack(pos + 1, sum, isTaken);
}

void solve()
{
	cin >> n;
	lld sum = 0;
	for (int i = 0; i < n; ++i)
	{
		cin >> ara[i];
		sum += ara[i];
	}
	std::vector<bool> isTaken(n, false);
	backtrack(0, sum, isTaken);
	cout << mn << endl;
}

int main()
{

#ifndef ONLINE_JUDGE
	clock_t tStart = clock();
	freopen("input.txt", "r", stdin);
	freopen("output.txt", "w", stdout);
#endif

	solve();

#ifndef ONLINE_JUDGE
	fprintf(stderr, "\n>> Runtime: %.10fs\n", (double) (clock() - tStart) / CLOCKS_PER_SEC);
#endif

	return 0;
}

`,
            };
            const watchInfo = await timusSubmit(submitInfo);
            console.log('Submission successful');
            const status = await watchTimusVerdict(watchInfo);
            res.send(status);
        } catch (error) {
            next(error);
        }
    })();
});

app.get('/spoj/login', (req, res, next) => {
    (async () => {
        try {
            const homePageHTML = await spojLogin();
            // console.log(homePageHTML);
            res.send(homePageHTML);
        } catch (error) {
            next(error);
        }
    })();
});

app.get('/spoj/submit', (req, res, next) => {
    (async () => {
        try {
            const code = String.raw`
#include <bits/stdc++.h>
using namespace std;
typedef long long int lld;
#define dbug cout <<"dukse" <<endl;
#define test int tt; scanf("%d", &tt); while(tt--)

#define mxs 10005
lld tree[mxs * 4];
lld a[mxs + 3];

void build(int at, int b, int e) {
    if (b == e) {tree[at] = a[b]; return;}
    int l = at * 2, r = at * 2 + 1, m = (b + e) / 2;
    build(l, b, m);
    build(r, m + 1, e);
    tree[at] = min(tree[l], tree[r]);
}

lld query(int at, int b, int e, int p, int q) {
    if (q<b or p>e) return 1e18;
    if (p <= b and e <= q) return tree[at];
    int l = at * 2, r = at * 2 + 1, m = (b + e) / 2;
    lld p1 = query(l, b, m, p, q);
    lld p2 = query(r, m + 1, e, p, q);
    return min(p1, p2);
}


int main() {
    lld tst = 1;
    test{
        lld n, q; scanf("%lld %lld", &n, &q);
        for(int i = 1; i<=n; i++){
            scanf("%lld", &a[i]);
        }
        build(1, 1, n);
        printf("Scenario #%lld:\n", tst++);
        while(q--){
            lld l,r; scanf("%lld %lld", &l, &r);
            printf("%lld\n", query(1,1,n, l, r));
        }
    }
    return 0;
}`;
            const watchInfo = await spojSubmit({
                problemIndex: 'RPLN',
                langID: 44,
                sourceCode: code,
            });
            console.log('Submission successful');
            const status = await watchSPOJVerdict(watchInfo);
            console.log(status);
            res.send(status);
        } catch (error) {
            next(error);
        }
    })();
});

app.use((err, req, res, next) => {
    if (req.headersSent) {
        next('There is a problem. Header already sent!');
    }
    if (err.message) {
        res.status(500).send(err.message);
    } else {
        res.status(500).send('There is a server side error');
    }
});
