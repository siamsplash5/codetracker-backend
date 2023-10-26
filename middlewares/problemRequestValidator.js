import responseHandler from '../handlers/response.handler.js';

function problemRequestValidator(req, res, next) {
    try {
        // eslint-disable-next-line prefer-const
        let { judge: myJudge, problemID: myProblemID, problemFetchingUrl } = req.body;

        if (problemFetchingUrl) {
            problemFetchingUrl = problemFetchingUrl.toLowerCase();

            // check if the given url is valid domain
            const cfRegex = /^https?:\/\/codeforces\.com\/[^\s]+$/;
            const timusRegex =
                /^https?:\/\/acm\.timus\.ru\/problem.aspx\?(space=[^\s]+&)?num=[^\s]+$/;
            const atcoderRegex = /^https?:\/\/atcoder\.jp\/contests\/[^\s]+\/tasks\/[^\s]+$/;
            const spojRegex = /^https?:\/\/(www\.)?spoj\.com\/problems\/\w+\/?$/i;

            let judge;

            if (cfRegex.test(problemFetchingUrl)) {
                judge = 'Codeforces';
            } else if (timusRegex.test(problemFetchingUrl)) {
                judge = 'Timus';
            } else if (atcoderRegex.test(problemFetchingUrl)) {
                judge = 'Atcoder';
            } else if (spojRegex.test(problemFetchingUrl)) {
                judge = 'Spoj';
            } else {
                return responseHandler.badRequest(res, 'Invalid URL');
            }

            // Uppercase the problemID from problemFetchingUrl for spoj
            if (judge === 'Spoj') {
                let problemID = problemFetchingUrl.replace('https://www.spoj.com/problems/', '');
                if (problemID.slice(-1) === '/') {
                    problemID = problemID.slice(0, -1);
                }
                const newProblemID = problemID.toUpperCase();
                problemFetchingUrl = problemFetchingUrl.replace(problemID, newProblemID);
            }
            req.body.judge = judge;
            req.body.problemFetchingUrl = problemFetchingUrl;
            next();
        } else if (myJudge && myProblemID) {
            myJudge = myJudge.toLowerCase();
            myProblemID = myProblemID.toUpperCase();
            if (myJudge === 'atcoder') {
                myProblemID = myProblemID.toLowerCase();
            }
            req.body.judge = `${myJudge.charAt(0).toUpperCase()}${myJudge.slice(1)}`;
            req.body.problemID = myProblemID;
            next();
        } else {
            throw new Error('Invalid judge/problemID');
        }
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}

export default problemRequestValidator;
