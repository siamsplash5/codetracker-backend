const express = require('express');

const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
    res.clearCookie('jwt');
    res.send('Logout succesful');
});

module.exports = logoutRouter;
