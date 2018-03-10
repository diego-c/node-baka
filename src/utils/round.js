"use strict";
/**
 * Rounds the provided number to the specified precision
 * @param { number } num The number to be rounded
 * @param { number } precision The number of decimal places to round num
 * @returns { number } The rounded number
 */
Object.defineProperty(exports, "__esModule", { value: true });
var round = function (num, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
};
exports.round = round;