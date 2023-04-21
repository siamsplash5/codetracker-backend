/* eslint-disable comma-dangle */
const superagent = require('superagent').agent();
const client = require('../data/client');

async function uvaLogin() {
    try {
        const loginData = {
            username: process.env.BOT_USERNAME,
            passwd: process.env.BOT_PASSWORD,
            op2: 'login',
            lang: 'english',
            force_session: 1,
            return: 'B:aHR0cDovL29ubGluZWp1ZGdlLm9yZy8=',
            message: 0,
            loginfrom: 'loginmodule',
            cbsecuritym3:
                'B:aHR0cDovL29ubGluZWp1ZGdlLm9yZy9pbmRleC5waHA/b3B0aW9uPWNvbV9sb2dpbiZhbXA7SXRlbWlkPTU=',
            j8e4928ad0a4eef64b158d2a7cb417642: 1,
            remember: 'yes',
            Submit: 'Login',
        };
        const res = await superagent
            .post(process.env.UVA_LOGIN_URL)
            .send(loginData)
            .set('Content-Type', 'application/x-www-form-urlencoded');

        client.setSuperAgent(superagent);
        return res;
    } catch (error) {
        return error;
    }
}

module.exports = { uvaLogin };
