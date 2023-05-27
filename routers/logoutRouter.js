import express from 'express';
import jwt from 'jsonwebtoken';
import blacklistedJWT from '../database/models/BlackListedJWT.js';
import responseHandler from '../handlers/response.handler.js';

const logoutRouter = express.Router();

logoutRouter.post('/', async (req, res) => {
    const { username } = req.body;
    try {
        const token = req.cookies.JSESSIONID;
        res.clearCookie('JSESSIONID');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { exp } = decodedToken;
        await blacklistedJWT.create({
            token,
            expiresAt: exp * 1000,
        });
        responseHandler.ok(res, {
            status: 200,
            message: `Goodbye ${username}!`,
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return responseHandler.ok(res, {
                status: 200,
                message: `Goodbye ${username}!`,
            });
        }
        console.log(error);
        responseHandler.error(res);
    }
});

export default logoutRouter;
