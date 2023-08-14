import { body, validationResult } from 'express-validator';
import responseHandler from '../handlers/response.handler.js';

export const otpValidator = [
    body('otp')
        .trim()
        .notEmpty()
        .withMessage("OTP can't be empty")
        .matches(/^\d{6}$/)
        .withMessage('Invalid OTP'),
];
export function runOTPValidation(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.badRequest(res, errors.array()[0].msg);
        }
        next();
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}
