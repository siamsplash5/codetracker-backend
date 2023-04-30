const express = require('express');
const superagent = require('superagent');

const checkRouter = express.Router();

checkRouter.get('/', async (req, res) => {
    const resp = await superagent.get(
        'https://codeforces.com/api/problemset.problems?tags=implementation'
    );
    console.log(resp.status);
    res.send(resp.body);
});

module.exports = checkRouter;
