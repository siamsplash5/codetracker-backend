import { spreadAtcoderProblemID, spreadCFProblemID } from './spreadProblemID.js';

export default function createProblemUrl(judge, problemID) {
    try {
        if (judge === 'Codeforces') {
            const { contestID, problemIndex } = spreadCFProblemID(problemID);
            return `https://codeforces.com/contest/${contestID}/problem/${problemIndex}`;
        }
        if (judge === 'Atcoder') {
            const { contestID } = spreadAtcoderProblemID(problemID);
            return `https://atcoder.jp/contests/${contestID}/tasks/${problemID}`;
        }
        if (judge === 'Spoj') {
            return `https://www.spoj.com/problems/${problemID.toUpperCase()}/`;
        }
        if (judge === 'Timus') {
            return `https://acm.timus.ru/problem.aspx?space=1&num=${problemID}`;
        }
        return null;
    } catch (error) {
        throw new Error(error);
    }
}
