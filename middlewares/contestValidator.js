import responseHandler from '../handlers/response.handler.js';

const contestValidator = (req, res, next) => {
    try {
        if (req.method === 'DELETE') {
            const { contestID } = req.body;
            if (!contestID) {
                return responseHandler.badRequest(res, "ContestID can't be empty");
            }
            return next();
        }
        if (req.method === 'POST') {
            const { privacy, password, title, startDate, startTime, problemSet } = req.body;
            if (privacy && title && startDate && startTime && problemSet.length) {
                if (privacy !== 'Public') {
                    if (password) {
                        return next();
                    }
                    return responseHandler.badRequest(res, "Password can't be empty");
                }
                return next();
            }
            return responseHandler.badRequest(res, "Any field can't be empty");
        }
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
};

export default contestValidator;
