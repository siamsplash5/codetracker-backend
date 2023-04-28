const express = require('express');

const checkRouter = express.Router();

checkRouter.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = checkRouter;
