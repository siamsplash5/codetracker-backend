/* eslint-disable comma-dangle */
const helper = require('../helpers/CFLoginHelper');
const client = require('../data/client');

async function cfLogin() {
    try {
        const csrf = await helper.getCsrf(process.env.CF_LOGIN_URL);
        const ftaa = await helper.genFtaa();
        const bfaa = await helper.genBfaa();
        const superagent = client.getSuperAgent();
        const loginData = {
            csrf_token: csrf,
            action: 'enter',
            ftaa,
            bfaa,
            handleOrEmail: process.env.BOT_USERNAME,
            password: process.env.BOT_PASSWORD,
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

        const handle = await helper.getHandle(res.text);
        return handle;
    } catch (error) {
        return error;
    }
}

module.exports = { cfLogin };
