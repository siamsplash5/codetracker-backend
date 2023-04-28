/*

problemIndex: 'RPLN',
langID: 44

*/

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
}