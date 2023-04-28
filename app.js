/* eslint-disable comma-dangle */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const submitRouter = require('./routers/submitRouter');
const checkRouter = require('./routers/checkRouter');

const app = express();

// database connection with mongoose
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log('Mongoose connection successful');
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`);
        });
    })
    .catch(console.error);

// routes
app.use('/check', checkRouter);
app.use('/submit', submitRouter);

app.use((err, req, res, next) => {
    if (req.headersSent) {
        next('There is a problem. Header already sent!');
    }
    if (err.message) {
        res.status(500).send(err.message);
    } else {
        res.status(500).send('There is a server side error');
    }
});
