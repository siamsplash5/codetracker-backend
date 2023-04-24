// this file will be replace by mongodb atlas in future
const client = {
    superagent: {},
    returnToken: '',
    cbsecurityToken: '',
    unknownToken: '',
    setSuperAgent(agent) {
        this.superagent = agent;
    },
    getSuperAgent() {
        return this.superagent;
    },
    setReturnToken(token) {
        this.returnToken = token;
    },
    getReturnToken() {
        return this.returnToken;
    },
    setCbsecurityToken(token) {
        this.cbsecurityToken = token;
    },
    getCbsecurityToken() {
        return this.cbsecurityToken;
    },
    setUnknownToken(token) {
        this.unknownToken = token;
    },
    getUnknownToken() {
        return this.unknownToken;
    },
};

module.exports = client;
