"use strict";
/**
 * Checks if the provided filename contains a file extension
 * If it doesn't, tries to guess the extension from the provided URL and appends it to the filename
 * @param { string } filename The filename to be checked
 * @param { string } url The URL to guess the file extension
 * @returns { string } Returns either the original filename (if it already contains a file extension) or the filename._extension_
 */
var checkFilename = function (filename, url) {
    var fullFilename = filename;
    if (!/\..+/.test(filename)) {
        fullFilename = '' + filename + require('./getExtension')(url);
    }
    return fullFilename;
};
module.exports = checkFilename;
