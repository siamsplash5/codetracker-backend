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
        if (req.method === 'POST' && req.url === '/api/contest/create') {
            const { privacy, password, title, problemSet } = req.body;
            if (privacy && title && problemSet.length) {
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
        return next();
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
};

export default contestValidator;
