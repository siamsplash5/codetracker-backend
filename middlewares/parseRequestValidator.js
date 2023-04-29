function parseRequestValidator(req, res, next) {
    const judges = ['codeforces', 'spoj', 'atcoder', 'timus'];
    let { judge, problemID } = req.body;

    if (judge === undefined || problemID === undefined || judge === '' || problemID === '') {
        next('Invalid parsing information');
    }

    judge = judge.toLowerCase();
    problemID = problemID.toUpperCase();

    if (!judges.includes(judge)) {
        next('Invalid parsing information');
    }

    req.body.judge = judge;
    req.body.problemID = problemID;
    next();
}

module.exports = parseRequestValidator;
