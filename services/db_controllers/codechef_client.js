// this file will be replace by mongodb atlas in future
const client = {
    superagent: {},
    formBuildId: '',
    setSuperAgent(agent) {
        this.superagent = agent;
    },
    getSuperAgent() {
        return this.superagent;
    },
    setFormBuildId(formBuildId) {
        this.formBuildId = formBuildId;
    },
    getFormBuildId() {
        return this.formBuildId;
    },
};

module.exports = client;
