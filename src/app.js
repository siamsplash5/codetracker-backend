const express = require('express');
const dotenv = require('dotenv');
const { login } = require('../utilites/login');
const { submit } = require('../utilites/submit');

const app = express();
dotenv.config();

app.get('/login', (req, res) => {
    (async () => {
        const userName = await login();
        console.log(`Login Successful! Current User: ${userName}`);
        res.send(`Logged in as a ${userName}`);
    })();
});

app.get('/submit', (req, res) => {
    (async () => {
        const msg = await submit();
        console.log('Submission successful');
        res.send(msg);
    })();
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
