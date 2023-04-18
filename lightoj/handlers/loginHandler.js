/* eslint-disable comma-dangle */
const superagent = require('superagent').agent();
const helper = require('../helpers/loginHelper');
const client = require('../data/client');

async function lightojLogin() {
    try {
        const recaptchaToken = helper.recaptchaToken();
        console.log(recaptchaToken);
        return recaptchaToken;
        // const loginData = {
        //     emailVerified: true,
        //     handleOrEmail: process.env.BOT_USERNAME,
        //     password: process.env.BOT_PASSWORD,
        //     recaptchaToken,
        // };
        // const res = await superagent
        //     .post(process.env.LIGHTOJ_LOGIN_URL)
        //     .send(loginData)
        //     .set('Content-Type', 'application/json;charset=UTF-8');

        // client.setSuperAgent(superagent);
        // client.setRecaptchaToken(recaptchaToken);

        // return res.text;
    } catch (error) {
        return error;
    }
}

module.exports = { lightojLogin };
