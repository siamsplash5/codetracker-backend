const superagent = require('superagent');

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

helper.getHandle = (body) => {
    const reg = /handle = "([\s\S]+?)"/;
    const tmp = reg.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find handle');
    }
    return tmp[1];
};

helper.getRandomString = (len) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < len; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

helper.genFtaa = () => helper.getRandomString(18);

helper.genBfaa = () => helper.getRandomString(32);

module.exports = helper;
