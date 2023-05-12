const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// routes
const submitRouter = require('./routers/submitRouter');
const checkRouter = require('./routers/checkRouter');
const problemRouter = require('./routers/problemRouter');
const registerRouter = require('./routers/registerRouter');
const loginRouter = require('./routers/loginRouter');
const logoutRouter = require('./routers/logoutRouter');
const contestRouter = require('./routers/contestRouter');

// middlewares
const authGuard = require('./middlewares/authGuard');
const contestValidator = require('./middlewares/contestValidator');
const parseRequestValidator = require('./middlewares/parseRequestValidator');

// App Object - module scaffolding
const app = express();

/**
 * Middleware
 * Parsing the incoming data
 */
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
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', authGuard, logoutRouter);
app.use('/check', authGuard, checkRouter);
app.use('/submit', authGuard, submitRouter);
app.use('/problem', parseRequestValidator, problemRouter);
app.use('/contest', authGuard, contestValidator, contestRouter);

/**
 * Error Handling Middleware
 */
app.use((err, req, res, next) => {
    if (res.headersSent) {
        // If headers already sent, pass the error to the default error handler
        next(err);
    } else {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;
