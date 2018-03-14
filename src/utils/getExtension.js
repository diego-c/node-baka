"use strict";
/**
 * Guess a file extension based on a provided URL
 * @param { string } url The URL to guess the file extension
 * @returns { string } The guessed file extension in the format ._extension_
 */
Object.defineProperty(exports, "__esModule", { value: true });
const getExtension = (url) => {
    const urlArr = url.split('.');
    return '.' + urlArr[urlArr.length - 1];
};
exports.getExtension = getExtension;
