/* eslint-disable comma-dangle */
const superagent = require('superagent').agent();
const helper = require('./helper');
const { submit } = require('./submit');

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
        await superagent
            .post(process.env.CF_LOGIN_URL)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        const resp = await submit(csrf, ftaa, bfaa);
        return resp;
    } catch (error) {
        return error;
    }
}

module.exports = { login };
