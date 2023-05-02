/* eslint-disable prettier/prettier */

// dependencies
const mongoose = require('mongoose').connection.useDb('problems');
const problemSchema = require('../schemas/timus_problem_schema');

// create model for documents
const Problem = mongoose.model('timus', problemSchema);

// module scaffolding
const helper = {};

function getVolume(problemID) {
    try {
        const volume = Math.ceil((Number(problemID) - 1000) / 300);
        return volume;
    } catch (error) {
        throw new Error('Invalid Parsing Information');
    }
}

// get the problem object from database
helper.readProblem = async (problemID) => {
    try {
        const volume = getVolume(problemID);
        const data = await Problem.findOne({ volume, 'problems.problemID': problemID }, { 'problems.$': 1 });
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
