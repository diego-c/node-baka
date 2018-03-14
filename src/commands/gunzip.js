"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const gzip_size_1 = __importDefault(require("gzip-size"));
const GunzipUI_1 = require("../UI/GunzipUI");
const checkDestination_1 = require("../utils/checkDestination");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const zlib_1 = require("zlib");
const WriteError_1 = require("../errors/WriteError");
const ReadError_1 = require("../errors/ReadError");
const FileError_1 = require("../errors/FileError");
const crypto_1 = require("crypto");
/**
 * Extract a local file.
 * @param { string } source The source file to be extracted
 * @param { string } filename The name of the extracted file. Defaults to "file._extension_"
 * @param { string } destination Where to store the extracted file. Defaults to the current directory
 * @param { string | null } password Optional password to decrypt the extracted file
 * @returns { Promise<Object | void> } Either resolves with an object containing fullFilename and destination of the extracted file or rejects with an error
 */
const gunzip = (source, filename = 'file', destination = __dirname, password) => {
    return new Promise((resolve, reject) => {
        checkDestination_1.checkDestination(destination);
        let fullFilename;
        if (source.match(/\.\w+/g)) {
            fullFilename = '' + filename + source.match(/\.\w+/g)[0];
        }
        else {
            fullFilename = filename;
        }
        const sourceFile = fs_1.createReadStream(source);
        const extractedFile = fs_1.createWriteStream(path_1.default.resolve(destination, fullFilename));
        let UI, status, written, currentChunk;
        gzip_size_1.default.file(source)
            .then(size => {
            UI = new GunzipUI_1.GunzipUI(fullFilename, destination, size);
            status = UI.buildUI();
            if (password) {
                sourceFile
                    .pipe(crypto_1.createDecipher('aes192', password))
                    .pipe(zlib_1.createGunzip())
                    .on('data', (chunk) => {
                    written = extractedFile.bytesWritten;
                    currentChunk = chunk;
                    UI.updateUI(status, written, chunk, false);
                })
                    .on('error', (err) => {
                    return reject(new ReadError_1.ReadError('Sorry, could not read the source file ' + err));
                })
                    .pipe(extractedFile)
                    .on('finish', () => {
                    UI.updateUI(status, written, currentChunk, true);
                    return resolve({ fullFilename, destination });
                })
                    .on('error', (err) => {
                    return reject(new WriteError_1.WriteError('Sorry, could not write data to the compressed file ' + err));
                });
            }
            else {
                sourceFile
                    .pipe(zlib_1.createGunzip())
                    .on('data', (chunk) => {
                    written = extractedFile.bytesWritten;
                    currentChunk = chunk;
                    UI.updateUI(status, written, chunk, false);
                })
                    .on('error', (err) => {
                    return reject(new ReadError_1.ReadError('Sorry, could not read the source file ' + err));
                })
                    .pipe(extractedFile)
                    .on('finish', () => {
                    UI.updateUI(status, written, currentChunk, true);
                    return resolve({ fullFilename, destination });
                })
                    .on('error', (err) => {
                    return reject(new WriteError_1.WriteError('Sorry, could not write data to the compressed file ' + err));
                });
            }
        })
            .catch(err => {
            return reject(new FileError_1.FileError('Could not open the source file! ' + err));
        });
    });
};
exports.gunzip = gunzip;
