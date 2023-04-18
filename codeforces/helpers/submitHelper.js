const helper = {};
// todo
helper.getVerdict = (body) => {
    const reg = /handle = "([\s\S]+?)"/;
    const tmp = reg.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find Verdict');
    }
    return tmp[1];
};

module.exports = helper;
