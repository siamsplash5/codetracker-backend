import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

// routes
import checkRouter from './routers/checkRouter.js';
import contestRouter from './routers/contestRouter.js';
import loginRouter from './routers/loginRouter.js';
import logoutRouter from './routers/logoutRouter.js';
import problemRouter from './routers/problemRouter.js';
import registerRouter from './routers/registerRouter.js';
import registrationVerifyRouter from './routers/registrationVerifyRouter.js';
import submitRouter from './routers/submitRouter.js';

// middlewares
import authGuard from './middlewares/authGuard.js';
import contestValidator from './middlewares/contestValidator.js';
import {loginValidationSchema, loginRequestValidator} from './middlewares/loginRequestValidator.js';
import parseRequestValidator from './middlewares/parseRequestValidator.js';
import {registerValidationSchema, registerRequestValidator} from './middlewares/registerRequestValidator.js';
import {verifyValidationSchema, verifyRequestValidator} from './middlewares/verifyRequestValidator.js';

//handlers
import responseHandler from './handlers/response.handler.js';
import { body } from 'express-validator';

// App Object - module scaffolding
const app = express();

/**
 * Middleware
 * Parsing the incoming data
 */

app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173/',
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Connect to the database and start the server
 */
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Mongoose connection successful');
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
    });

/**
 * Register routes
 */
app.use('/api/login', loginValidationSchema, loginRequestValidator, loginRouter);
app.use('/api/register', registerValidationSchema, registerRequestValidator, registerRouter);
app.use('/api/register-verify',verifyValidationSchema, verifyRequestValidator, registrationVerifyRouter);
app.use('/api/logout', authGuard, logoutRouter);

app.use('/api/check', authGuard, checkRouter);
app.use('/api/submit', authGuard, submitRouter);
app.use('/api/problem', parseRequestValidator, problemRouter);
app.use('/api/contest', authGuard, contestValidator, contestRouter);

/**
 * Error Handling Middleware
 */
app.use((err, req, res, next) => {
    if (res.headersSent) {
        next(err);
    } else {
        console.error(err);
        responseHandler.error(res);
    }
});

export default app;
