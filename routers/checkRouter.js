const express = require('express');
const superagent = require('superagent');

const checkRouter = express.Router();

checkRouter.get('/', async (req, res) => {
    res.redirect('/verify');
});

module.exports = checkRouter;
