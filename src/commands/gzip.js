"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkDestination_1 = require("../utils/checkDestination");
const checkFilename_1 = require("../utils/checkFilename");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const round_1 = require("../utils/round");
const zlib_1 = require("zlib");
const gzip = (source, filename = 'file', destination = __dirname, password) => {
    return new Promise((resolve, reject) => {
        checkDestination_1.checkDestination(destination);
        const fullFilename = checkFilename_1.checkFilename(filename, source);
        const sourceFile = fs_1.createReadStream(source);
        const compressedFile = fs_1.createWriteStream(path_1.default.resolve(destination, fullFilename + '.gz'));
        sourceFile
            .pipe(zlib_1.createGzip())
            .on('data', (chunk) => {
            console.log('Compressed: ' + round_1.round(chunk.length / 1000000, 2) + ' MB');
        })
            .on('error', (err) => {
            return reject(err);
        })
            .pipe(compressedFile)
            .on('finish', () => {
            console.log('Finished!');
        })
            .on('error', (err) => {
            return reject(err);
        });
        return resolve({ fullFilename, destination });
    });
};
exports.gzip = gzip;
