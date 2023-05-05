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

// middlewares
const authGuard = require('./middlewares/authGuard');
const parseRequestValidator = require('./middlewares/parseRequestValidator');

// App Object - module scaffodling
const app = express();

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// database connection with mongoose
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
    .catch(console.error);

// use routes
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/check', authGuard, checkRouter);
app.use('/submit', submitRouter);
app.use('/problem', parseRequestValidator, problemRouter);

// default error handler
app.use((err, req, res, next) => {
    if (req.headersSent) {
        next('There is a problem. Header already sent!');
    } else {
        console.log(err);
        res.status(500).send(err);
    }
});
