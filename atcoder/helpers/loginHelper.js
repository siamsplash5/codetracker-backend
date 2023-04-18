const superagent = require('superagent').agent();
const client = require('../data/client');

const helper = {};

helper.getBody = async (url) => {
    const res = await superagent.get(url);
    client.setSuperAgent(superagent);
    if (!res.status === 200) {
        return new Error('Unable to fetch CSRF token');
    }
    return res.text;
};

helper.getCsrf = async (url) => {
    const body = await helper.getBody(url);
    const regex = /var csrfToken = "(.*?)"/;
    const tmp = regex.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find csrf');
    }
    return tmp[1];
};

helper.getHandle = (body) => {
    const regex = /userScreenName = "([\s\S]+?)"/;
    const tmp = regex.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find handle');
    }
    return tmp[1];
};

module.exports = helper;
