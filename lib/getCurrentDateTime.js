function getCurrentDateTime() {
    const date = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Dhaka',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
    return date;
}

export default getCurrentDateTime;
