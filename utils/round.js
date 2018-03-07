/**
 * Rounds the provided number to the specified precision
 * @param { number } num The number to be rounded 
 * @param { number } precision The number of decimal places to round num
 * @returns { number } The rounded number
 */

const round = (num, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}

module.exports = round;