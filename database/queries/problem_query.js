/* eslint-disable prettier/prettier */

// dependencies
const Atcoder = require('../models/AtcoderProblem');
const Codeforces = require('../models/CodeforcesProblem');
const Spoj = require('../models/SpojProblem');
const Timus = require('../models/TimusProblem');

// module scaffolding
const helper = {};

function getAtcoderVolume(problemID) {
    try {
        const regex = /^(abc|arc)\d{3}_[a-zA-Z\d]+$/;
        if (regex.test(problemID) === false) {
            return 0;
        }
        const regex2 = /(abc|arc)(\d+)/;
        const match = regex2.exec(problemID);
        if (match) {
            const contestID = match[2];
            return Math.ceil(contestID / 50);
        }
        return null;
    } catch (error) {
        throw new Error('Invalid Parsing Information');
    }
}

function getCodeforcesVolume(problemID) {
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

// eslint-disable-next-line no-unused-vars
function getSpojVolume(problemID) {
    return 0;
}

function getTimusVolume(problemID) {
    try {
        const volume = Math.ceil((Number(problemID) - 1000) / 300);
        return volume;
    } catch (error) {
        throw new Error('Invalid Parsing Information');
    }
}

function getModelAndVolume(judge, problemID) {
    if (judge === 'atcoder') {
        const volume = getAtcoderVolume(problemID);
        const Problem = Atcoder;
        return { volume, Problem };
    }
    if (judge === 'codeforces') {
        const volume = getCodeforcesVolume(problemID);
        const Problem = Codeforces;
        return { volume, Problem };
    }
    if (judge === 'spoj') {
        const volume = getSpojVolume(problemID);
        const Problem = Spoj;
        return { volume, Problem };
    }
    if (judge === 'timus') {
        const volume = getTimusVolume(problemID);
        const Problem = Timus;
        return { volume, Problem };
    }
    return null;
}

// get the problem object from database
helper.readProblem = async (judge, problemID) => {
    try {
        const { volume, Problem } = getModelAndVolume(judge, problemID);
        const data = await Problem.findOne({ volume, 'problems.problemID': problemID }, { 'problems.$': 1 });
        if (data === null) return 'not found';
        return data.problems[0];
    } catch (error) {
        console.log(error);
        throw new Error('Error when read problem info from database');
    }
};

// create problem object in database
helper.createProblem = async (judge, problem) => {
    try {
        console.log('Create problem called');
        const { problemID } = problem;
        const { volume, Problem } = getModelAndVolume(judge, problemID);
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
