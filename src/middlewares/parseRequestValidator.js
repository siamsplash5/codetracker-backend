/* eslint-disable operator-linebreak */
function parseRequestValidator(req, res, next) {
    try {
        let { problemUrl } = req.body;

        if (!problemUrl || problemUrl === '') {
            res.send('Invalid Url');
        }

        const cfRegex = /^https?:\/\/codeforces\.com\/[^\s]+$/;
        const timusRegex = /^https?:\/\/acm\.timus\.ru\/problem.aspx\?(space=[^\s]+&)?num=[^\s]+$/;
        const atcoderRegex = /^https?:\/\/atcoder\.jp\/contests\/[^\s]+\/tasks\/[^\s]+$/;
        const spojRegex = /^https?:\/\/www\.spoj\.com\/problems\/[^\s]+\/$/;
        problemUrl = problemUrl.toLowerCase();

        if (
            !(
                cfRegex.test(problemUrl) ||
                timusRegex.test(problemUrl) ||
                atcoderRegex.test(problemUrl) ||
                spojRegex.test(problemUrl)
            )
        ) {
            res.send('Invalid Url');
        }

        let judge;

        const cfDomainRegex = /codeforces\.com/;
        const timusDomainRegex = /acm\.timus\.ru/;
        const atcoderDomainRegex = /atcoder\.jp/;
        const spojDomainRegex = /spoj\.com/;

        if (cfDomainRegex.test(problemUrl)) {
            judge = 'codeforces';
        } else if (timusDomainRegex.test(problemUrl)) {
            judge = 'timus';
        } else if (atcoderDomainRegex.test(problemUrl)) {
            judge = 'atcoder';
        } else if (spojDomainRegex.test(problemUrl)) {
            judge = 'spoj';
        } else {
            res.send('Invalid Url');
        }

        // Uppercase the problemID from problemUrl for spoj
        if (judge === 'spoj') {
            let problemID = problemUrl.replace('https://www.spoj.com/problems/', '');
            if (problemID.slice(-1) === '/') {
                problemID = problemID.slice(0, -1);
            }
            const newProblemID = problemID.toUpperCase();
            problemUrl = problemUrl.replace(problemID, newProblemID);
        }

        req.body.judge = judge;
        req.body.problemUrl = problemUrl;
        next();
    } catch (error) {
        console.log(error);
        res.send('Internal Server Error');
    }
}

module.exports = parseRequestValidator;
