export function spreadCFProblemID(problemID) {
    const regex = /^(\d+)([A-Za-z]+(\d+)?)$/;
    const matches = problemID.match(regex);

    if (matches) {
        const contestID = matches[1];
        const problemIndex = matches[2];
        return { contestID, problemIndex };
    }
    return null;
}

export function spreadAtcoderProblemID(problemID) {
    const lastIndex = problemID.lastIndexOf('_');
    if (lastIndex !== -1) {
        const contestID = problemID.substring(0, lastIndex);
        const problemIndex = problemID.substring(lastIndex + 1);
        return { contestID, problemIndex };
    }
    return null;
}
