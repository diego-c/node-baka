"use strict";
/**
 * Guess a file extension based on a provided URL
 * @param { string } url The URL to guess the file extension
 * @returns { string } The guessed file extension in the format .<extension>
 */
var getExtension = function (url) {
    var urlArr = url.split('.');
    return '.' + urlArr[urlArr.length - 1];
};
module.exports = getExtension;
