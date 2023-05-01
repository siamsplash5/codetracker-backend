/* eslint-disable prettier/prettier */

// dependencies
const mongoose = require('mongoose').connection.useDb('problems');
const problemSchema = require('../schemas/cf_problem_schema');

// create model for documents
const Problem = mongoose.model('Codeforces', problemSchema);

// module scaffolding
const helper = {};

function getVolume(problemID) {
    try {
        const matches = problemID.match(/^(\d+)([a-zA-Z0-9]+)$/);
        const contestID = Number(matches[1]);
        if (Number.isNaN(contestID)) {
            throw new Error();
        }
        return Math.ceil(contestID / 200);
    } catch (error) {
        throw new Error('Invalid Parsing Information');
    }
}

// get the problem object from database
helper.readProblem = async (problemID) => {
    try {
        const volume = getVolume(problemID);
        const data = await Problem.findOne({ volume, 'problems.problemID': problemID }, { _id: 0, volume: 0, __v: 0 });
        if (data === null) return 'not found';
        return data.problems[0];
    } catch (error) {
        throw new Error('Error when read problem info from database');
    }
};

// create problem object in database
helper.createProblem = async (problem) => {
    try {
        console.log('Create problem called');
        const { problemID } = problem;
        const volume = getVolume(problemID);
        const volumeDocument = await Problem.findOne({ volume });
        if (volumeDocument !== null) {
            await Problem.updateOne({ volume }, { $push: { problems: problem } });
        } else {
            const data = { volume, problems: [problem], };
            Problem.create(data);
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error when create problem info in database');
    }
};

module.exports = helper;
