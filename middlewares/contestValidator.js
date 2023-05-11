/* eslint-disable prefer-const */
const contestValidator = (req, res, next) => {
    try {
        if (req.method === 'DELETE') {
            const { contestID } = req.body;
            if (contestID === null || contestID === undefined || contestID === '') {
                res.send('Invalid contest ID');
                return;
            }
            next();
            return;
        }

        let { contestID, privacy, password, title, category, beginTime, duration, problemSet } =
            req.body;

        if (req.method === 'PUT' || req.method === 'DELETE') {
            if (contestID === null || contestID === undefined) {
                res.send('Enter the contest ID');
                return;
            }
        }

        if (privacy === null || privacy === undefined) {
            res.send('Invalid privacy');
            return;
        }
        privacy = privacy.trim();
        if (privacy !== 'public' && privacy !== 'protected' && privacy !== 'private') {
            res.send('Invalid privacy');
            return;
        }
        if (
            privacy !== 'public' &&
            (password === null || password === undefined || password === '')
        ) {
            res.send("Password field can't be empty");
            return;
        }
        if (privacy !== 'public') password = password.trim();

        if (title === null || title === undefined) {
            res.send("Title can't be empty");
            return;
        }

        if (category) {
            category = category.trim();
            if (category !== 'practice' && category !== 'competition') {
                res.send("Category can't be empty");
                return;
            }
        }
        if (beginTime) {
            beginTime = beginTime.trim();
            if (Number.isNaN(Date.parse(beginTime))) {
                res.send('Invalid date format');
                return;
            }
        }
        if (duration === null || duration === undefined) {
            res.send("Contest duration can't be empty");
            return;
        }
        if (problemSet === null || problemSet === undefined || problemSet.length === 0) {
            res.send("Problem set can't be empty");
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.send('Internal Server Error');
    }
};

module.exports = contestValidator;
