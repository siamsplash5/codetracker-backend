/* eslint-disable prefer-const */
const contestValidator = (req, res, next) => {
    try {
        if (req.method === 'DELETE') {
            const { contestID } = req.body;
            if (!contestID) {
                res.send('Invalid contest ID');
                return;
            }
            next();
            return;
        }

        let { contestID, privacy, password, title, category, beginTime, duration, problemSet } =
            req.body;

        if (req.method === 'PUT' || req.method === 'DELETE') {
            if (!contestID) {
                res.send('Enter the contest ID');
                return;
            }
        }

        if (!privacy) {
            res.send('Invalid privacy');
            return;
        }
        privacy = privacy.trim();
        if (privacy !== 'public' && privacy !== 'protected' && privacy !== 'private') {
            res.send('Invalid privacy');
            return;
        }
        if (privacy !== 'public' && (!password || password === '')) {
            res.send("Password field can't be empty");
            return;
        }
        if (privacy !== 'public') {
            password = password.trim();
        }

        if (!title) {
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

        if (!duration) {
            res.send("Contest duration can't be empty");
            return;
        }

        if (!problemSet || problemSet.length === 0) {
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
