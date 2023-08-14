import { body, validationResult } from 'express-validator';
import responseHandler from '../handlers/response.handler.js';

export const passwordUpdateRequestValidator = [
    body('otp')
        .trim()
        .notEmpty()
        .withMessage("OTP can't be empty")
        .matches(/^\d{6}$/)
        .withMessage('Invalid OTP'),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage("Password can't be empty")
        .isLength({ min: 8 })
        .withMessage('Password must contain a minimum of 8 characters'),
];

export function runPasswordUpdateValidation(req, res, next) {
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
