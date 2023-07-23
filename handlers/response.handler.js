/* eslint-disable prettier/prettier */
const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data);

const error = (res) => responseWithData(res, 200, {
        status: 500,
        message: 'Opps! Something went wrong!',
    });

const badRequest = (res, message) => responseWithData(res, 200, {
        status: 400,
        message,
    });

const ok = (res, data) => responseWithData(res, 200, data);

const created = (res, data) => responseWithData(res, 201, data);

const pending = (res, data) => responseWithData(res, 202, data);

const unauthorize = (res, message) => responseWithData(res, 200, {
        status: 401,
        message,
    });

const forbidden = (res) => responseWithData(res, 200, {
        status: 403,
        message: 'Admin specific only',
    });

const notfound = (res) => responseWithData(res, 200, {
        status: 404,
        message: 'Resource not found',
    });

export default {
    error,
    badRequest,
    ok,
    created,
    pending,
    unauthorize,
    forbidden,
    notfound,
};
