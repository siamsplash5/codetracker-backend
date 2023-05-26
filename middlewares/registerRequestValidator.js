import { body, validationResult } from 'express-validator';
import responseHandler from '../handlers/response.handler.js';

export const registerValidationSchema = [
            body('username')
            .trim()
            .notEmpty()
            .withMessage("Username can't be empty")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage('Username should contain only letters, numbers and dot(.)'),

            body('email')
                .trim()
                .notEmpty()
                .withMessage("Email can't be empty")
                .toLowerCase()
                .isEmail()
                .withMessage('Enter valid email'),

            body('password')
                .trim()
                .notEmpty()
                .withMessage("Password can't be empty")
                .isLength({ min: 8 })
                .withMessage('Password must contain a minimum of 8 characters')
        ];

export function registerRequestValidator (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.badRequest(res, errors.array()[0].msg);
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        responseHandler.error(res);
    }
}
