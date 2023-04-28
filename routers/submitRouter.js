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
            contestID: 'abc032',
            problemIndex: 'c',
            langID: 4003,
            sourceCode: String.raw`#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;
#define FOR(i, a, b) for (int i = (a); i < (b); ++i)
#define REP(i, n) FOR(i, 0, n)

int solve(vector<int> s, int k) {
  auto it = find(s.begin(), s.end(), 0);
  if (it != s.end())
    return s.size();
  int ans{};
  for (int left = 0; left < s.size(); ++left) {
    int sum = 1;
    for (int right = left; right < s.size(); ++right) {
      // cout << left << " " << right << endl;
      sum *= s[right];
      if (sum <= k) {
        ans = max(ans, right - left + 1);
      } else {
        // cout << right - left + 1 << endl;
        // cout << "break" << endl;
        break;
      }
    }
  }
  return ans;
}

int main() {
  int n, k;
  cin >> n >> k;
  vector<int> s(n);
  REP(i, n) cin >> s[i];
  cout << solve(s, k) << endl;
}
`,
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
