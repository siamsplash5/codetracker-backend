import responseHandler from "../handlers/response.handler.js";
import {body, validationResult} from "express-validator";

export const verifyValidationSchema = [
    body('otp')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("OTP can't be empty")
    .matches(/^\d{6}$/)
    .withMessage("Invalid OTP")
]


export function verifyRequestValidator(req, res, next){
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHandler.badRequest(res, errors.array()[0].msg);
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
}