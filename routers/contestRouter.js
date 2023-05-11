const express = require('express');
const contestModel = require('../database/models/Contest');

const contestRouter = express.Router();

contestRouter.post('/', async (req, res) => {
    try {
        const contest = req.body;
        contest.setter = req.username;
        const { _id } = await contestModel.create(contest);
        res.send(`Contest created successfully. ID: ${_id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

contestRouter.put('/', async (req, res) => {
    try {
        const { contestID } = req.body;
        await contestModel.findOneAndUpdate({ _id: contestID }, req.body);
        res.send('Contest updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

contestRouter.delete('/', async (req, res) => {
    try {
        const { contestID } = req.body;
        await contestModel.deleteOne({ _id: contestID });
        res.send('Contest deleted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');74568
    }
});

module.exports = contestRouter;
