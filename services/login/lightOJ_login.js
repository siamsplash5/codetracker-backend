/* eslint-disable comma-dangle */
const superagent = require('superagent').agent();
const helper = require('../helpers/loginHelper');
const client = require('../data/client');

/* eslint-disable max-len */
const helper = {};
// // eslint-disable-next-line prettier/prettier
// helper.recaptchaToke = () => '03AKH6MRGbZ4Y28lCBQsY601lrQSCjIRigl9HQ7lD4cHON2B8-X3bZMT5AllWBcSJA56uKL6pXirzEjYhMd84GVXVUi7jq-6YHsh3eQDmK6gIp7pxBgO2vpRaxqiDaVOkJOZjxQKsty7Y5kUyvtLbkVIXCzba8QwKhI9-FholepHsUpYdvzeAftynd3Eer5c2Tt2yg9tetgyyi6ud77CsDc2ZKuYWHO-0-Sxc50UZdhHJllltt0vfTSY_87RSg1P7rf4IQqJpKmb3lUNGgv1BSXTh6GKcysPJB4uKEztVFyZw9EF1NCuSSm9TX4u7vJL9jo6H8jcdtZujNlTX8kjs-LDrJKomH8kVLHos8eyVQOWAkQM3MViqIK91O9jmTMBqduzjggYy5hVGsIxoBAfAgPjl2xagQtLiX6IbHFs-rjyDkKrqQl2rBBn78jPvUi0y8f5x9RTT-9qVKh2G6wxzgBBvxJ87yHu4VP1cQP2DvX9QA78nDJp1BZF29RtXy1wAfk8sR1Fcd1HBI5Z8-x7Sp0ANYqH47xnOUPQ';

const superagent = require('superagent');
const querystring = require('querystring');

const siteKey = '6LdLuZolAAAAAIveqRAQ2OTQZ3h-ROZPwdE7tsHo';
const secretKey = '6LdLuZolAAAAAMc_CSiwTMoG1fr60dt4grziY_fJ';

helper.generateRecaptchaToken = async () => {
    const params = {
        method: 'userrecaptcha',
        googlekey: siteKey,
        key: secretKey,
        pageurl: 'https://lightoj.com/auth/login',
    };

    const response = await superagent
        .post('https://2captcha.com/in.php')
        .type('form')
        .send(querystring.stringify(params));

    console.log(response);
    if (response.body?.status === 1) {
        const captchaId = response.body.request;
        const tokenResponse = await superagent.get(
            `https://2captcha.com/res.php?action=get&id=${captchaId}&key=${secretKey}&json=1&retry=30&min_timeout=1000&max_timeout=60000`,
        );

        if (tokenResponse.body?.status === 1) {
            const token = tokenResponse.body.request;
            return token;
        }
        throw new Error(`Failed to generate reCAPTCHA token: ${tokenResponse.body?.request}`);
    } else {
        throw new Error(`Failed to generate reCAPTCHA token: ${response.body?.request}`);
    }
};

helper.getHandle = (body) => {
    const reg = /userScreenName = "([\s\S]+?)"/;
    const tmp = reg.exec(body);
    if (tmp && tmp.length < 2) {
        throw new Error('Cannot find handle');
    }
    return tmp[1];
};

module.exports = helper;


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
