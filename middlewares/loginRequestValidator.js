import responseHandler from '../handlers/response.handler.js';

const loginRequestValidator = (req, res, next) =>{
    try {
        const {username, password} = req;
        if (!username || !password) {
            console.log('Username/password is missing');
            res.send("Username/Password field can't be empty");
            return;
        }
    } catch (error) {
        console.log(object);
        responseHandler.error(res);
    }
}

export default loginRequestValidator;