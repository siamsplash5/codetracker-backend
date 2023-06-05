import express from 'express';
import responseHandler from '../handlers/response.handler.js';

const checkRouter = express.Router();
/**
 * GET /check
 * Check endpoint
 */

function extractInfo(timestamp) {
    const date = new Date(timestamp);

    function getMonthName(month) {
        const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        return monthNames[month];
    }

    function padZero(number) {
        return number.toString().padStart(2, '0');
    }
    const formattedDate = `${getMonthName(date.getMonth())}/${padZero(
        date.getDate()
    )}/${date.getFullYear()} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    return formattedDate;
}
checkRouter.post('/', (req, res) => {
    try {
        const data = extractInfo(Date.now());
        responseHandler.ok(res, data);
    } catch (error) {
        console.log(error);
        responseHandler.error(res);
    }
});

export default checkRouter;
