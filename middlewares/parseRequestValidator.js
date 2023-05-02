function parseRequestValidator(req, res, next) {
    const judges = ['codeforces', 'spoj', 'atcoder', 'timus'];
    let { judge, url } = req.body;

    if (judge === undefined || url === undefined || judge === '' || url === '') {
        next('Invalid parsing information');
    }

    judge = judge.toLowerCase();

    if (!judges.includes(judge)) {
        next('Invalid parsing information');
    }

    req.body.judge = judge;
    next();
}

module.exports = parseRequestValidator;
