const round = require('./round');

module.exports = (connectionSpeed, remaining) => {
    return format(remaining * 1000 / connectionSpeed);
}

function format(secondsRemaining) {
    return new Date(null, null, null, null, null, secondsRemaining).toString().match(/\d{2}:\d{2}:\d{2}/)[0];
}