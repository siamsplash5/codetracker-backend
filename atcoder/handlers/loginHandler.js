/* eslint-disable comma-dangle */
const helper = require('../helpers/loginHelper');
const client = require('../data/client');

async function atcoderLogin() {
    try {
        const csrf = await helper.getCsrf(process.env.ATCODER_LOGIN_URL);
        const superagent = client.getSuperAgent();
        const loginData = {
            username: process.env.BOT_USERNAME,
            password: process.env.BOT_PASSWORD,
            csrf_token: csrf,
        };

        const res = await superagent
            .post(process.env.ATCODER_LOGIN_URL)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        client.setCsrf(csrf);
        client.setSuperAgent(superagent);

        const handle = await helper.getHandle(res.text);
        return handle;
    } catch (error) {
        return error;
    }
}

module.exports = { atcoderLogin };
