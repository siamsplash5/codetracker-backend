/* eslint-disable no-unreachable */
const superagent = require('superagent').agent();

async function parseSPOJProblem(problemID) {
    try {
        return 'Hello SPOJ';
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = parseSPOJProblem;
