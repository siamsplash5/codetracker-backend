/**
 * Remove index (i.e A, B, G2) from the problem title
 * @param {string} judge - The judge of the problem for which the title have to modify
 * @param {string} title - The title with problem index
 * @returns {string} The title witout the problem index

 */

export default function extractTitle(judge, title) {
    let breakPoint = '';
    if (judge === 'Atcoder' || judge === 'Spoj') {
        breakPoint = '- ';
    } else {
        breakPoint = '. ';
    }
    const separatorIndex = title.indexOf(breakPoint);
    if (separatorIndex !== -1) {
        return title.substring(separatorIndex + 2);
    }
    return title;
}
