const superagent = require('superagent').agent();
const client = require('../data/client');

const helper = {};

helper.getBody = async (url) => {
    const response = await superagent.get(url);
    client.setSuperAgent(superagent);
    if (!response.status === 200) {
        return new Error('Unable to fetch form_build_id');
    }
    return response.text;
};

helper.getFormBuildId = async (url) => {
    const body = await helper.getBody(url);
    const reg = /<input[^>]*name="form_build_id"[^>]*value="([^"]*)"[^>]*>/;
    const tmp = reg.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find form_build_id');
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
