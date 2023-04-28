/*

contestID: '1822'
problemIndex: 'B'
langID: 73

*/
                
#include <bits/stdc++.h>
using namespace std;

#define DIM 51

int q, n;
long long a[DIM];

void doo(){
    sort(a,a+n);
    cout << max(a[0]*a[1],a[n-1]*a[n-2]) << "\n";
}

int main() {
    ios_base::sync_with_stdio(0); cin.tie(0); cout.tie(0);
    cin >> q;
    while (q--) {
        cin >> n;
        for (int i = 0; i < n; i++) cin >> a[i];
        doo();
    }
}