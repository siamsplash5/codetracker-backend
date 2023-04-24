/* eslint-disable no-promise-executor-return */
/* eslint-disable comma-dangle */
const helper = require('../helpers/loginHelper');
const client = require('../data/client');

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


async function codechefLogin() {
    try {
        const formBuildId = await helper.getFormBuildId(
            'https://www.codechef.com/login?destination=/'
        );
        const superagent = client.getSuperAgent();
        const loginData = {
            name: process.env.BOT_USERNAME,
            pass: process.env.BOT_PASSWORD,
            form_build_id: formBuildId,
            form_id: 'ajax_login_form',
        };
        const res = await superagent
            .post(process.env.CODECHEF_LOGIN_URL)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        client.setFormBuildId(formBuildId);
        client.setSuperAgent(superagent);
        return res.text;
    } catch (error) {
        return error;
    }
}

module.exports = { codechefLogin };
