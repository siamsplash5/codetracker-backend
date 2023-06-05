/**
 * Convert the miliseconds to a  May/08/2023 17:45 format
 * @param {Number} timestamp - Time in miliseconds
 * @returns {Object} - converted time and date as a object.
 */

export default function dateFormatter(timestamp) {
    const myDate = new Date(timestamp);

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
    const convertedDate = `${getMonthName(myDate.getMonth())}/${padZero(
        myDate.getDate()
    )}/${myDate.getFullYear()}`;

    const convertedTime = `${padZero(myDate.getHours())}:${padZero(myDate.getMinutes())}`;
    return { convertedDate, convertedTime };
}
