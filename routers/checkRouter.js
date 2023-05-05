const express = require('express');

const checkRouter = express.Router();

checkRouter.get('/', (req, res) => {
    res.send('Heehe boi');
});

module.exports = checkRouter;
