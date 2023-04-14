// Dependencies
const express = require('express');
const dotenv = require('dotenv');
const { getBody, getCsrf } = require('../utilites/helpers');

dotenv.config();

// Module scaffolding
const app = express();

// Creating a default router for our app
app.get('/', (req, res) => {
    (async () => {
        const url = 'https://codeforces.com/enter';
        try {
            const body = await getBody(url);
            const csrf = getCsrf(body);
            console.log(csrf);
        } catch (error) {
            console.error(error);
        }
    })();
    res.send('Helle boi');
});

// Listening on port 5000
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
