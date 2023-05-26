import responseHandler from '../handlers/response.handler.js';
import { body, validationResult } from 'express-validator';

export const loginValidationSchema = [
            body('username')
            .trim()
            .notEmpty()
            .withMessage("Username can't be empty")
            .toLowerCase()
            .matches(/^[a-z0-9._-]+$/)
            .withMessage('Invalid username'),

            body('password')
                .trim()
                .notEmpty()
                .withMessage("Password can't be empty")
                .isLength({ min: 8 })
                .withMessage('Invalid password')
        ];

export function loginRequestValidator (req, res, next) {
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
