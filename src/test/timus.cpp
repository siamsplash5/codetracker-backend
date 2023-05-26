/*

problemIndex: 1005
langID: 68

*/

#include <bits/stdc++.h>
using namespace std;
typedef long long int ll;
#define test ll t; cin >>t; while(t--)
int ara[25];
int n, mn = 10e7 + 6;

void BT(int pos, int sum, std::vector<bool> isTaken) {
    if (pos == n) {
        int sum1 = 0;
        for (int i = 0; i < n; i++) {
            if (isTaken[i])sum1 += ara[i];
        }
        int sum2 = sum - sum1;
        mn = min(mn, abs(sum1 - sum2));
        return;
    }
    BT(pos + 1, sum, isTaken);
    isTaken[pos] = true;
    BT(pos + 1, sum, isTaken);
}

int main() {
    cin >> n;
    ll sum = 0;
    for (int i = 0; i < n; ++i) {
        cin >> ara[i];
        sum += ara[i];
    }
    std::vector<bool> isTaken(n, false);
    BT(0, sum, isTaken);
    cout << mn << endl;
    return 0;
}