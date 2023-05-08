/* eslint-disable prettier/prettier */

// dependencies
const submisionModel = require('../models/Submission');

// module scaffolding
const helper = {};

// get the problem object from database
// helper.readProblem = async (judge, problemID) => {
//     try {
//         if (data === null) return 'not found';
//         return data.problems[0];
//     } catch (error) {
//         console.log(error);
//         throw new Error('Error when read problem info from database');
//     }
// };

// create problem object in database
helper.updateSubmission = async (submission) => {
    try {
        // console.log('Create problem called');
        const submissionData = new submisionModel();
        await submissionData.save();
    } catch (error) {
        console.log(error);
        throw new Error('Error when create problem info in database');
    }
};

module.exports = helper;
