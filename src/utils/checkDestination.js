"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
/**
 * Checks a destination path
 * If it doesn't exist, creates one or more directories until it's valid
 * @param { string } dest The destination path to be checked
 * @returns { void }
 */
var checkDestination = function (dest) {
    var destinations = dest.split('/');
    var currDest = destinations[0];
    destinations.forEach(function (destination, i) {
        currDest = destinations.slice(0, i + 1).join('/');
        if (!fs_1.existsSync(currDest)) {
            fs_1.mkdirSync(currDest);
        }
    });
};
exports.checkDestination = checkDestination;
