import express from 'express';
import jwt from 'jsonwebtoken';
import blacklistedToken from '../database/models/BlacklistedTokens.js';
import responseHandler from '../handlers/response.handler.js';

const logoutRouter = express.Router();

logoutRouter.post('/', async (req, res) => {
    const { username, token } = req.body;
    try {
        // const token = req.cookies.JSESSIONID;
        // res.clearCookie('JSESSIONID');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { exp } = decodedToken;
        await blacklistedToken.create({
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
