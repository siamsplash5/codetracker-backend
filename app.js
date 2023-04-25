/* eslint-disable comma-dangle */
const express = require('express');
const dotenv = require('dotenv');
const superagent = require('superagent').agent();
const mongoose = require('mongoose');

// const client = require('../uva/data/client');
// const { codeforcesLogin } = require('./services/login/codeforces_login');
// const { codeforcesSubmit } = require('./services/submit/codeforces_submit');
// const { atcoderLogin } = require('./services/login/atcoder_login');
const { atcoderSubmit } = require('./services/submit/atcoder_submit');
// const { lightojLogin } = require('../lightoj/handlers/loginHandler');
// const { codechefLogin } = require('../codechef/handlers/loginHandler');
// const { codechefSubmit } = require('../codechef/handlers/submitHandler');
// const { spojLogin } = require('./services/login/spoj_login');
// const { spojSubmit } = require('./services/submit/spoj_submit');
// const { uvaLogin } = require('../uva/handlers/loginHandler');
// const { timusSubmit } = require('./services/submission/timus_submit');

const app = express();
dotenv.config();

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
        res.send('hello checker');
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
            const info = {
                contestID: '4',
                problemIndex: 'A',
                langID: 73,
                sourceCode: String.raw`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int w; cin >> w;
    if(w % 2 == 0 && w > 4){
        printf("YES\n");
    }else{
        cout <<"NO" <<endl;
    }
}
            `,
            };
            const msg = await codeforcesSubmit(info);
            console.log('Submission successful');
            res.send(msg);
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
    lld op = 0, pos = 1;
    while (1) {
        if (pos == 2)break;
        if (mark[pos]) {
            op = -1;
            break;
        }
        mark[pos] = 1;
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
            const verdict = await timusSubmit({
                problemIndex: 1848,
                langID: 68,
                sourceCode: `/******************************Templates***********************************/

#include <bits/stdc++.h>
using namespace std;

#define test                      lld t; cin >>t; while(t--)
#define Y                         cout <<"YES" <<endl;
#define N                         cout <<"NO" <<endl;
#define dbug                      cout <<"dukse" <<endl;
#define lcm(x, y)                 (x*y)/__gcd(x, y)
#define pi                        acos(-1)
#define fst                       first
#define snd                       second
#define cube(x)                   (x*x*x)
#define pb                        push_back
#define mp                        make_pair
#define bi                        binary_search()
#define ms                        100005
#define GR                        1.61803398875
#define eps                       1e-9
#define mod                       1000000007
#define eulerNumber               2.718281828

typedef unsigned long long        ull;
typedef long long int             lld;

/*****************************----START----*******************************/

lld tree[ms * 3];
lld pos, num;
void update(int node, int b, int e) {
	if (pos<b or pos>e)
		return;
	if (b == e and b == pos) {
		tree[node] = num;
		return;
	}
	lld left = 2 * node;
	lld right = 2 * node + 1;
	lld mid = (b + e) / 2;
	update(left, b, mid);
	update(right, mid + 1, e);
	tree[node] = __gcd(tree[left], tree[right]);
}

void solve() {
	lld q; cin >> q;
	lld add = 0, rmv = 0;
	lld idx = 1;
	std::map<lld, std::vector<lld> > umap;
	memset(tree, 0, sizeof(tree));
	while (q--) {
		char ch;
		cin >> ch >> num;
		if (ch == '-') {
			rmv++;
			pos = umap[num].back();
			umap[num].pop_back();
			num = 0;
		}
		else {
			add++;
			umap[num].push_back(idx);
			pos = idx;
		}
		if (add == rmv) {
			cout << 1 << endl;
			continue;
		}
		idx++;
		update(1, 1, ms);
		cout << tree[1] << endl;
	}
}

int main() {
#ifndef ONLINE_JUDGE
	clock_t tStart = clock();
	freopen("input.txt", "r", stdin);
	freopen("output.txt", "w", stdout);
#endif
	ios_base::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL);

	solve();

#ifndef ONLINE_JUDGE
	fprintf(stderr, "\n>> Runtime: %.10fs\n", (double) (clock() - tStart) / CLOCKS_PER_SEC);
#endif
	return 0;
}
`,
            });
            console.log(verdict);
            res.send(verdict);
        } catch (error) {
            next(error);
        }
    })();
});

app.get('/spoj/login', (req, res, next) => {
    (async () => {
        try {
            const homePageHTML = await spojLogin();
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
#define test lld t; cin >>t; while(t--)

#define m 100000007
lld f[500005];
int main() {
    f[1] = 1;
    f[2] = 1;
    for (int i = 3; i <= 500000; i++) {
        f[i] = (f[i - 1] % m + f[i - 2] % m) % m;
    }
    test{
        lld n; scanf("%lld", &n);
        printf("%lld\n", f[n]);
    }
    return 0;
}`;
            const resp = await spojSubmit({
                problemIndex: 'FIBEZ',
                langID: 44,
                sourceCode: code,
            });
            res.send(resp);
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
