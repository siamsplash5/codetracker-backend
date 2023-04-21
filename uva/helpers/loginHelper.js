const superagent = require('superagent').agent();
const client = require('../data/client');

const helper = {};

helper.getBody = async (url) => {
    const response = await superagent.get(url);
    client.setSuperAgent(superagent);
    if (!response.status === 200) {
        return new Error('Unable to fetch CSRF token');
    }
    return response.text;
};

helper.getCsrf = async (url) => {
    const body = await helper.getBody(url);
    const reg = /var csrfToken = "(.*?)"/;
    const tmp = reg.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find csrf');
    }
    return tmp[1];
};

helper.getHandle = (body) => {
    const reg = /userScreenName = "([\s\S]+?)"/;
    const tmp = reg.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find handle');
    }
    return tmp[1];
};

module.exports = helper;
