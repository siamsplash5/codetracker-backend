/* eslint-disable operator-linebreak */
function parseRequestValidator(req, res, next) {
    let { url } = req.body;

    if (url === undefined || url === '') {
        next('Invalid url');
    }

    const cfRegex = /^https?:\/\/codeforces\.com\/[^\s]+$/;
    const timusRegex = /^https?:\/\/acm\.timus\.ru\/problem.aspx\?(space=[^\s]+&)?num=[^\s]+$/;
    const atcoderRegex = /^https?:\/\/atcoder\.jp\/contests\/[^\s]+\/tasks\/[^\s]+$/;
    const spojRegex = /^https?:\/\/www\.spoj\.com\/problems\/[^\s]+\/$/;
    url = url.toLowerCase();

    if (
        !(
            cfRegex.test(url) ||
            timusRegex.test(url) ||
            atcoderRegex.test(url) ||
            spojRegex.test(url)
        )
    ) {
        next('Invalid url');
    }

    let judge;

    const cfDomainRegex = /codeforces\.com/;
    const timusDomainRegex = /acm\.timus\.ru/;
    const atcoderDomainRegex = /atcoder\.jp/;
    const spojDomainRegex = /spoj\.com/;

    if (cfDomainRegex.test(url)) {
        judge = 'codeforces';
    } else if (timusDomainRegex.test(url)) {
        judge = 'timus';
    } else if (atcoderDomainRegex.test(url)) {
        judge = 'atcoder';
    } else if (spojDomainRegex.test(url)) {
        judge = 'spoj';
    } else {
        next('Invalid Url');
    }

    // uppercase the problemID from url for spoj
    if (judge === 'spoj') {
        let problemID = url.replace('https://www.spoj.com/problems/', '');
        if (problemID.slice(-1) === '/') problemID = problemID.slice(0, -1);
        const newProblemID = problemID.toUpperCase();
        url = url.replace(problemID, newProblemID);
    }

    req.body.judge = judge;
    req.body.url = url;
    console.log({ judge, url });
    next();
}

module.exports = parseRequestValidator;
