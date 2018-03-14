"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gzip_size_1 = __importDefault(require("gzip-size"));
const GzipUI_1 = require("../UI/GzipUI");
const checkDestination_1 = require("../utils/checkDestination");
const checkFilename_1 = require("../utils/checkFilename");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const zlib_1 = require("zlib");
const WriteError_1 = require("../errors/WriteError");
const ReadError_1 = require("../errors/ReadError");
const FileError_1 = require("../errors/FileError");
const crypto_1 = require("crypto");
/**
 * Compress a local file.
 * @param { string } source The source file to be compressed
 * @param { string } filename The name of the compressed file. Defaults to "file._extension_"
 * @param { string } destination Where to store the compressed file. Defaults to the current directory
 * @param { string | null } password Optional password to encrypt the compressed file
 * @returns { Promise<Object | void> } Either resolves with an object containing fullFilename and destination of the compressed file or rejects with an error
 */
const gzip = (source, filename = 'file', destination = __dirname, password) => {
    return new Promise((resolve, reject) => {
        checkDestination_1.checkDestination(destination);
        const fullFilename = '' + checkFilename_1.checkFilename(filename, source) + '.gz';
        const sourceFile = fs_1.createReadStream(source);
        const compressedFile = fs_1.createWriteStream(path_1.default.resolve(destination, fullFilename));
        let UI, status, written, currentChunk;
        gzip_size_1.default.file(source)
            .then(size => {
            UI = new GzipUI_1.GzipUI(fullFilename, destination, size);
            status = UI.buildUI();
            let gzipFile = sourceFile.pipe(zlib_1.createGzip());
            if (password) {
                gzipFile = gzipFile.pipe(crypto_1.createCipher('aes192', password));
            }
            gzipFile
                .on('data', (chunk) => {
                written = compressedFile.bytesWritten;
                currentChunk = chunk;
                UI.updateUI(status, written, chunk, false);
            })
                .on('error', (err) => {
                return reject(new ReadError_1.ReadError('Sorry, could not read the source file ' + err));
            })
                .pipe(compressedFile)
                .on('finish', () => {
                UI.updateUI(status, written, currentChunk, true);
                return resolve({ fullFilename, destination });
            })
                .on('error', (err) => {
                return reject(new WriteError_1.WriteError('Sorry, could not write data to the compressed file ' + err));
            });
        })
            .catch(err => {
            return reject(new FileError_1.FileError('Could not open the source file! ' + err));
        });
    });
};
exports.gzip = gzip;
