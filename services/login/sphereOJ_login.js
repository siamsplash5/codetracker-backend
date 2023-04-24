/* eslint-disable comma-dangle */
const superagent = require('superagent').agent();
const client = require('../data/client');

async function spojLogin() {
    try {
        const loginData = {
            next_raw: '/',
            autologin: 1,
            login_user: process.env.BOT_USERNAME,
            password: process.env.BOT_PASSWORD,
        };
        const res = await superagent
            .post(process.env.SPOJ_LOGIN_URL)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        client.setSuperAgent(superagent);

        return res.text;
    } catch (error) {
        return error;
    }
}

module.exports = { spojLogin };
