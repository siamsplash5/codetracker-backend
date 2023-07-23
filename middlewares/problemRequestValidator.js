import responseHandler from '../handlers/response.handler.js';

function problemRequestValidator(req, res, next) {
    try {
        // eslint-disable-next-line prefer-const
        let { judge: myJudge, problemID: myProblemID, problemUrl } = req.body;

        if (problemUrl) {
            problemUrl = problemUrl.toLowerCase();

            // check if the given url is valid domain
            const cfRegex = /^https?:\/\/codeforces\.com\/[^\s]+$/;
            const timusRegex =
                /^https?:\/\/acm\.timus\.ru\/problem.aspx\?(space=[^\s]+&)?num=[^\s]+$/;
            const atcoderRegex = /^https?:\/\/atcoder\.jp\/contests\/[^\s]+\/tasks\/[^\s]+$/;
            const spojRegex = /^https?:\/\/(www\.)?spoj\.com\/problems\/\w+\/?$/i;

            if (
                !(
                    cfRegex.test(problemUrl) ||
                    timusRegex.test(problemUrl) ||
                    atcoderRegex.test(problemUrl) ||
                    spojRegex.test(problemUrl)
                )
            ) {
                return responseHandler.badRequest(res, 'Invalid URL');
            }

            let judge;

            const cfDomainRegex = /codeforces\.com/;
            const timusDomainRegex = /acm\.timus\.ru/;
            const atcoderDomainRegex = /atcoder\.jp/;
            const spojDomainRegex = /spoj\.com/;

            if (cfDomainRegex.test(problemUrl)) {
                judge = 'Codeforces';
            } else if (timusDomainRegex.test(problemUrl)) {
                judge = 'Timus';
            } else if (atcoderDomainRegex.test(problemUrl)) {
                judge = 'Atcoder';
            } else if (spojDomainRegex.test(problemUrl)) {
                judge = 'Spoj';
            } else {
                return responseHandler.badRequest(res, 'Invalid URL');
            }

            // Uppercase the problemID from problemUrl for spoj
            if (judge === 'Spoj') {
                let problemID = problemUrl.replace('https://www.spoj.com/problems/', '');
                if (problemID.slice(-1) === '/') {
                    problemID = problemID.slice(0, -1);
                }
                const newProblemID = problemID.toUpperCase();
                problemUrl = problemUrl.replace(problemID, newProblemID);
            }
            req.body.judge = judge;
            req.body.problemUrl = problemUrl;
        } else if (myJudge && myProblemID) {
            myJudge = myJudge.toLowerCase();
            myProblemID = myProblemID.toUpperCase();
            if (myJudge === 'atcoder') {
                myProblemID = myProblemID.toLowerCase();
            }
            req.body.judge = `${myJudge.charAt(0).toUpperCase()}${myJudge.slice(1)}`;
            req.body.problemID = myProblemID;
        } else {
            throw new Error('Invalid judge/problemID');
        }
        next();
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}

export default problemRequestValidator;
