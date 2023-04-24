/* eslint-disable comma-dangle */
const client = require('../data/client');
const helper = require('../helpers/loginHelper');

const superagent = require('superagent').agent();
const cheerio = require('cheerio');
const client = require('../data/client');

const helper = {};

helper.getTokens = async (url) => {
    try {
        const res = await superagent.get(url);
        if (res.status !== 200) {
            throw new Error('Unable to get the html body');
        }
        const html = res.text;
        const $ = cheerio.load(html);
        const returnToken = $('input[name="return"]').attr('value');
        const cbsecurityToken = $('input[name="cbsecuritym3"]').attr('value');
        const unknownToken = $('input[value="1"]:eq(1)').attr('name');

        client.setSuperAgent(superagent);
        client.setReturnToken(returnToken);
        client.setCbsecurityToken(cbsecurityToken);
        client.setUnknownToken(unknownToken);
        return '';
    } catch (error) {
        console.log(error);
        return 'fetching cbsecuritym3 token failed';
    }
};

module.exports = helper;


async function uvaLogin() {
    try {
        await helper.getTokens(process.env.UVA_LOGIN_URL);
        const superagent = client.getSuperAgent();
        const returnToken = client.getReturnToken();
        const cbsecurityToken = client.getCbsecurityToken();
        const unknownToken = client.getUnknownToken();

        // console.log(returnToken);
        // console.log(cbsecurityToken);
        // console.log(unknownToken);

        const loginData = {
            username: process.env.BOT_USERNAME,
            passwd: process.env.BOT_PASSWORD,
            op2: 'login',
            lang: 'english',
            force_session: 1,
            return: returnToken,
            message: 0,
            loginfrom: 'loginform',
            cbsecuritym3: cbsecurityToken,
            [unknownToken]: 1,
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
