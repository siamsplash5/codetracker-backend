import { body, validationResult } from 'express-validator';
import responseHandler from '../handlers/response.handler.js';

export const loginValidationSchema = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage("Username can't be empty")
        .toLowerCase()
        .matches(/^[a-z0-9._-]+$/)
        .withMessage('Invalid username/password'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage("Password can't be empty")
        .isLength({ min: 8 })
        .withMessage('Invalid username/password'),
];

export function loginRequestValidator(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.badRequest(res, errors.array()[0].msg);
        }
        next();
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
}
