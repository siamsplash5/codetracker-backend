const express = require('express');
const contestModel = require('../database/models/Contest');

const contestRouter = express.Router();

/**
 * POST /contest
 * Create a new contest
 */
contestRouter.post('/', async (req, res) => {
    try {
        const contest = req.body;
        contest.setter = req.username;
        const createdContest = await contestModel.create(contest);
        const { _id } = createdContest;
        res.send(`Contest created successfully. ID: ${_id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

/**
 * PUT /contest
 * Update an existing contest
 */
contestRouter.put('/', async (req, res) => {
    try {
        const { contestID, ...contestData } = req.body;
        await contestModel.findByIdAndUpdate(contestID, contestData);
        res.send('Contest updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

/**
 * DELETE /contest
 * Delete a contest
 */
contestRouter.delete('/', async (req, res) => {
    try {
        const { contestID } = req.body;
        await contestModel.findByIdAndDelete(contestID);
        res.send('Contest deleted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = contestRouter;
