const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

// routes
const submitRouter = require('./routers/submitRouter');
const checkRouter = require('./routers/checkRouter');
const problemRouter = require('./routers/problemRouter');

// middlewares
const parseRequestValidator = require('./middlewares/parseRequestValidator');

// App Object - module scaffodling
const app = express();

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/check', checkRouter);
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
