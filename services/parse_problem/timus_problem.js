/* eslint-disable no-unreachable */
const superagent = require('superagent').agent();

async function parseTimusProblem(problemID) {
    try {
        return 'Hello Timus';
    } catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = parseTimusProblem;
