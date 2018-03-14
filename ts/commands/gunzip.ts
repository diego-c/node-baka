import gzipSize from 'gzip-size';
import { GunzipUI } from '../UI/GunzipUI';
import { checkDestination } from '../utils/checkDestination';
import { createReadStream, createWriteStream, WriteStream, ReadStream } from 'fs';
import path from 'path';
import { createGunzip } from 'zlib';
import { Status } from '../UI/Status';
import { WriteError } from '../errors/WriteError';
import { ReadError } from '../errors/ReadError';
import { FileError } from '../errors/FileError';
import { createDecipher } from 'crypto';

/**
 * Extract a local file.
 * @param { string } source The source file to be extracted
 * @param { string } filename The name of the extracted file. Defaults to "file._extension_"
 * @param { string } destination Where to store the extracted file. Defaults to the current directory
 * @param { string | null } password Optional password to decrypt the extracted file
 * @returns { Promise<Object | void> } Either resolves with an object containing fullFilename and destination of the extracted file or rejects with an error
 */

const gunzip = (source: string, filename: string = 'file', destination: string = __dirname, password?: string): Promise<Object | void> => {

    return new Promise((resolve: Function, reject: Function) => {

        checkDestination(destination);
        let fullFilename: string;

        let matches: Array<string>;
        if ((matches = source.match(/\.\w+/g)) !== null) {
            fullFilename = /\.\w+/.test(filename) ? filename : ('' + filename + matches[matches.length - 2]);
        } else {
            fullFilename = filename;
        }

        const sourceFile: ReadStream = createReadStream(source);

        const extractedFile: WriteStream = createWriteStream(path.resolve(destination, fullFilename));

        let UI: GunzipUI,
            status: Status,
            written: number,
            currentChunk: Buffer | string;

        gzipSize.file(source)
            .then(size => {

                UI = new GunzipUI(fullFilename, destination, size);
                status = UI.buildUI();

                if (password) {
                    sourceFile
                        .pipe(createDecipher('aes192', password))
                        .pipe(createGunzip())
                        .on('data', (chunk: Buffer) => {
                            written = extractedFile.bytesWritten;
                            currentChunk = chunk;
                            UI.updateUI(status, written, chunk, false);
                        })
                        .on('error', (err: Error) => {
                            return reject(new ReadError('Sorry, could not read the source file ' + err));
                        })
                        .pipe(extractedFile)
                        .on('finish', () => {
                            UI.updateUI(status, written, currentChunk, true);
                            return resolve({ fullFilename, destination });
                        })
                        .on('error', (err: Error) => {
                            return reject(new WriteError('Sorry, could not write data to the compressed file ' + err));
                        })
                }

                else {
                    sourceFile
                        .pipe(createGunzip())
                        .on('data', (chunk: Buffer) => {
                            written = extractedFile.bytesWritten;
                            currentChunk = chunk;
                            UI.updateUI(status, written, chunk, false);
                        })
                        .on('error', (err: Error) => {
                            return reject(new ReadError('Sorry, could not read the source file ' + err));
                        })
                        .pipe(extractedFile)
                        .on('finish', () => {
                            UI.updateUI(status, written, currentChunk, true);
                            return resolve({ fullFilename, destination });
                        })
                        .on('error', (err: Error) => {
                            return reject(new WriteError('Sorry, could not write data to the compressed file ' + err));
                        })
                }
            })
            .catch(err => {
                return reject(new FileError('Could not open the source file! ' + err));
            })
    })
}

export { gunzip };