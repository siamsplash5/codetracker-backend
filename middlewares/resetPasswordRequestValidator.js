import { body, validationResult } from 'express-validator';
import responseHandler from '../handlers/response.handler.js';

export const resetPasswordValidationSchema = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage("Username can't be empty")
        .toLowerCase()
        .matches(/^[a-z0-9._-]+$/)
        .withMessage('Invalid username'),
];

export function resetPasswordRequestValidator(req, res, next) {
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
