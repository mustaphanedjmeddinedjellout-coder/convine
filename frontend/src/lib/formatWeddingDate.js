const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export function parseEventDate(dateString) {
    if (!dateString) {
        return { day: '20', month: 'August', year: '2026' };
    }

    const date = new Date(`${dateString}T12:00:00`);

    return {
        day: String(date.getDate()),
        month: MONTHS[date.getMonth()],
        year: String(date.getFullYear()),
    };
}

export function formatEventTime(timeString) {
    if (!timeString) {
        return '7:00 PM';
    }

    const [hoursPart, minutesPart = '00'] = timeString.split(':');
    const hours = Number(hoursPart);
    const minutes = minutesPart.padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes} ${period}`;
}

export function getCountdownTarget(dateString, timeString) {
    const time = timeString || '19:00';
    return new Date(`${dateString}T${time}:00`);
}
