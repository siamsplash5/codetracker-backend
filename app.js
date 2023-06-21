/* eslint-disable prettier/prettier */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

// routes
import checkRouter from './routers/checkRouter.js';
import contestProblemRouter from './routers/contestProblemRouter.js';
import contestQueryRouter from './routers/contestQueryRouter.js';
import contestRouter from './routers/contestRouter.js';
import loginRouter from './routers/loginRouter.js';
import logoutRouter from './routers/logoutRouter.js';
import passwordVerifyRouter from './routers/passwordVerifyRouter.js';
import problemAllRouter from './routers/problemAllRouter.js';
import problemRouter from './routers/problemRouter.js';
import registerRouter from './routers/registerRouter.js';
import registrationVerifyRouter from './routers/registrationVerifyRouter.js';
import resetPasswordRouter from './routers/resetPasswordRouter.js';
import submissionQueryRouter from './routers/submissionQueryRouter.js';
import submitRouter from './routers/submitRouter.js';

// middlewares
import authGuard from './middlewares/authGuard.js';
import contestValidator from './middlewares/contestValidator.js';
import {
    loginRequestValidator,
    loginValidationSchema
} from './middlewares/loginRequestValidator.js';
import {
    passwordVerifyRequestSchema,
    passwordVerifyRequestValidator
} from './middlewares/passwordVerifyRequestValidator.js';
import problemRequestValidator from './middlewares/problemRequestValidator.js';
import {
    registerRequestValidator,
    registerValidationSchema
} from './middlewares/registerRequestValidator.js';
import {
    resetPasswordRequestValidator,
    resetPasswordValidationSchema
} from './middlewares/resetPasswordRequestValidator.js';
import {
    verifyRequestValidator,
    verifyValidationSchema
} from './middlewares/verifyRequestValidator.js';

// handlers
import responseHandler from './handlers/response.handler.js';

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
app.use(
    '/api/reset-password',
    resetPasswordValidationSchema,
    resetPasswordRequestValidator,
    resetPasswordRouter
);
app.use(
    '/api/reset-password-verify',
    passwordVerifyRequestSchema,
    passwordVerifyRequestValidator,
    passwordVerifyRouter
);

app.use('/api/register', registerValidationSchema, registerRequestValidator, registerRouter);
app.use(
    '/api/register-verify',
    verifyValidationSchema,
    verifyRequestValidator,
    registrationVerifyRouter
);

app.use('/api/logout', authGuard, logoutRouter);

app.use('/api/check', checkRouter);

app.use('/api/submit', authGuard, submitRouter);
app.use('/api/submissiondata', authGuard, submissionQueryRouter);

app.use('/api/problem', problemRequestValidator, problemRouter);
app.use('/api/problem-all', problemAllRouter);

app.use('/api/contest', authGuard, contestValidator, contestRouter);
app.use('/api/contest-query', contestQueryRouter);
app.use('/api/contest-problem', contestProblemRouter);

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
