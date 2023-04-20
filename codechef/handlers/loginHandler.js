/* eslint-disable no-promise-executor-return */
/* eslint-disable comma-dangle */
const helper = require('../helpers/loginHelper');
const client = require('../data/client');

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
