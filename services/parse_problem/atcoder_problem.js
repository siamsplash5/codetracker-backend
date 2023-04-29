/* eslint-disable no-unreachable */
const superagent = require('superagent').agent();

async function parseAtcoderProblem(problemID) {
    try {
        return 'Hello Atcoder';
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = parseAtcoderProblem;
