// this file will be replace by mongodb atlas in future
const client = {
    superagent: {},
    recaptchaToken: '',
    setSuperAgent(agent) {
        this.superagent = agent;
    },
    getSuperAgent() {
        return this.superagent;
    },
    setRecaptchaToken(recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
    },
    getRecaptchaToken() {
        return this.recaptchaToken;
    },
};

module.exports = client;
