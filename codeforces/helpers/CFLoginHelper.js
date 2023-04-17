const superagent = require('superagent');
const getRandomString = require('../../helpers/randomStringGenerator');

const helper = {};

helper.getBody = async (url) => {
    const response = await superagent.get(url);
    if (!response.status === 200) {
        return new Error('Unable to fetch CSRF token');
    }
    return response.text;
};

helper.getCsrf = async (url) => {
    const body = await helper.getBody(url);
    const reg = /csrf='(.+?)'/;
    const tmp = reg.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find csrf');
    }
    return tmp[1];
};

helper.genFtaa = () => getRandomString(18);

helper.genBfaa = () => getRandomString(32);

helper.getHandle = (body) => {
    const reg = /handle = "([\s\S]+?)"/;
    const tmp = reg.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find handle');
    }
    return tmp[1];
};

module.exports = helper;
