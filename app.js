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
import forgotPasswordRouter from './routers/forgotPasswordRouter.js';
import loginRouter from './routers/loginRouter.js';
import logoutRouter from './routers/logoutRouter.js';
import problemRouter from './routers/problemRouter.js';
import registerRouter from './routers/registerRouter.js';
import registrationVerifyRouter from './routers/registrationVerifyRouter.js';
import setNewPasswordRouter from './routers/setNewPasswordRouter.js';
import submissionQueryRouter from './routers/submissionQueryRouter.js';
import submitRouter from './routers/submitRouter.js';

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
        origin: ['https://codetrackervj.vercel.app', 'http://localhost:5173'],
        credentials: true,
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

// API Routes

app.use('/api/check', checkRouter);
app.use('/api/login', loginRouter);
app.use('/api/forgot-password', forgotPasswordRouter);
app.use('/api/forgot-password/update', setNewPasswordRouter);
app.use('/api/logout', logoutRouter);

app.use('/api/register', registerRouter);
app.use('/api/register-verify', registrationVerifyRouter);

app.use('/api/submit', submitRouter);
app.use('/api/submissions', submissionQueryRouter);

app.use('/api/problem', problemRouter);

app.use('/api/contest', contestRouter);
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
