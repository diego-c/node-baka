/**
 * Get the estimated time to finish an operation
 * @param { number } connectionSpeed The connection speed (in KB/s)
 * @param { number } remaining The remaining data to be transferred (in MB)
 * @returns { string } Returns the ETA in the format HH : MM : SS 
 */
const eta = (connectionSpeed, remaining) => {
    return format(remaining * 1000 / connectionSpeed);
}

/**
 * Converts time from seconds to the format HH : MM : SS
 * @param { number } secondsRemaining The amount of seconds to be converted
 * @returns { string } Returns the formatted time
 */
function format(secondsRemaining) {
    return new Date(null, null, null, null, null, secondsRemaining).toString().match(/\d{2}:\d{2}:\d{2}/)[0];
}

module.exports = eta;