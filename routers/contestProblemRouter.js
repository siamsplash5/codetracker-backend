// import express from 'express';
// import responseHandler from '../handlers/response.handler.js';

// const problemRouter = express.Router();
// /**
//  * POST /problem Router
//  * Return contests problem from database
//  * First check it in database
//  * If problem not found, then
//  * 1. The problem will scrap from the corresponding judge
//  * 2. Store the problem in database
//  * 3. Return the problem to the user
//  * 4. Report anything wrong occurs (eg. invalid url/problemID)
//  */

// problemRouter.post('/all', async (req, res) => {
//     try {
//         // eslint-disable-next-line prefer-const
//         const problemSet = req.body;
//         const atcoderProblemID = [];
//         const codeforcesProblemID = [];
//         const spojProblemID = [];
//         const timusProblemID = [];
//         problemSet.forEach((problem) => {
//             if (problem.judge === 'Atcoder') {
//                 atcoderProblemID.push(problem.problemID);
//             } else if (problem.judge === 'Codeforces') {
//                 codeforcesProblemID.push(problem.problemID);
//             } else if (problem.judge === 'Spoj') {
//                 spojProblemID.push(problem.problemID);
//             } else if (problem.judge === 'Timus') {
//                 timusProblemID.push(problem.problemID);
//             }
//         });


//         responseHandler.ok(res, problem);
//     } catch (error) {
//         console.log(error);
//         if (error.message === 'Invalid Url') {
//             responseHandler.badRequest(res, error.message);
//         } else {
//             responseHandler.error(res);
//         }
//     }
// });

// export default problemRouter;
// const User = require('./models/user'); // Assuming you have a User model

// const names = ['Jhon', 'Ron', 'Messiah'];

// User.find({ name: { $in: names } })
//     .then((users) => {
//         console.log(users);
//         // Process the retrieved users as needed
//     })
//     .catch((error) => {
//         console.error(error);
//         // Handle any errors that occur during the query
//     });
