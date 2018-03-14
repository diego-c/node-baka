import gzipSize from 'gzip-size';
import { GzipUI } from '../UI/GzipUI';
import { checkDestination } from '../utils/checkDestination';
import { checkFilename } from '../utils/checkFilename';
import { createReadStream, createWriteStream, WriteStream, ReadStream } from 'fs';
import path from 'path';
import { createGzip } from 'zlib';
import { Status } from '../UI/Status';
import { WriteError } from '../errors/WriteError';
import { ReadError } from '../errors/ReadError';
import { FileError } from '../errors/FileError';
import { createCipher } from 'crypto';

/**
 * Compress a local file.
 * @param { string } source The source file to be compressed
 * @param { string } filename The name of the compressed file. Defaults to "file._extension_"
 * @param { string } destination Where to store the compressed file. Defaults to the current directory
 * @param { string | null } password Optional password to encrypt the compressed file
 * @returns { Promise<Object | void> } Either resolves with an object containing fullFilename and destination of the compressed file or rejects with an error
 */

const gzip = (source: string, filename: string = 'file', destination: string = __dirname, password?: string): Promise<Object | void> => {

    return new Promise((resolve: Function, reject: Function) => {

        checkDestination(destination);
        const fullFilename: string = '' + checkFilename(filename, source) + '.gz';

        const sourceFile: ReadStream = createReadStream(source);

        const compressedFile: WriteStream = createWriteStream(path.resolve(destination, fullFilename));

        let UI: GzipUI,
            status: Status,
            written: number,
            currentChunk: Buffer | string;

        gzipSize.file(source)
            .then(size => {

                UI = new GzipUI(fullFilename, destination, size);
                status = UI.buildUI();

                let gzipFile: any = sourceFile.pipe(createGzip());

                if (password) {
                    gzipFile = gzipFile.pipe(createCipher('aes192', password));
                }
                gzipFile
                    .on('data', (chunk: Buffer) => {
                        written = compressedFile.bytesWritten;
                        currentChunk = chunk;
                        UI.updateUI(status, written, chunk, false);
                    })
                    .on('error', (err: Error) => {
                        return reject(new ReadError('Sorry, could not read the source file ' + err));
                    })
                    .pipe(compressedFile)
                    .on('finish', () => {
                        UI.updateUI(status, written, currentChunk, true);
                        return resolve({ fullFilename, destination });
                    })
                    .on('error', (err: Error) => {
                        return reject(new WriteError('Sorry, could not write data to the compressed file ' + err));
                    })
            })
            .catch(err => {
                return reject(new FileError('Could not open the source file! ' + err));
            })
    })
}

export { gzip };