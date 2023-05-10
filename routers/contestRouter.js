const express = require('express');

const contestRouter = express.Router();

contestRouter.post('/create', (req, res) => {
    res.send('Contest created successfully');
});

contestRouter.post('/update', (req, res) => {
    res.send('Contest updated successfully');
});

contestRouter.delete('/delete', (req, res) => {
    res.send('Contest deleted successfully');
});

module.exports = contestRouter;
