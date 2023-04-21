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
