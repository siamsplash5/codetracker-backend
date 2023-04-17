/* eslint-disable comma-dangle */
const superagent = require('superagent').agent();
const helper = require('./helper');
const client = require('./client');

async function login() {
    try {
        const csrf = await helper.getCsrf(process.env.CF_LOGIN_URL);
        const ftaa = await helper.genFtaa();
        const bfaa = await helper.genBfaa();
        const loginData = {
            csrf_token: csrf,
            action: 'enter',
            ftaa,
            bfaa,
            handleOrEmail: process.env.CF_USERNAME,
            password: process.env.CF_PASSWORD,
            remember: 'on',
            _tta: 104,
        };
        const res = await superagent
            .post(process.env.CF_LOGIN_URL)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        client.setSuperAgent(superagent);
        client.setCsrf(csrf);
        client.setFtaa(ftaa);
        client.setBfaa(bfaa);
        console.log(client);
        const handle = await helper.getHandle(res.text);
        return handle;
    } catch (error) {
        return error;
    }
}

module.exports = { login };
